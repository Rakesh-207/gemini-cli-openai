import {
	Env,
	StreamChunk,
	ReasoningData,
	UsageData,
	ChatMessage,
	MessageContent,
	Tool,
	ToolChoice,
	GeminiFunctionCall
} from "./types";
import { AuthManager } from "./auth";
import { CredentialManager } from "./credential-manager";
import { CODE_ASSIST_ENDPOINT, CODE_ASSIST_API_VERSION } from "./config";
import { REASONING_MESSAGES, REASONING_CHUNK_DELAY, THINKING_CONTENT_CHUNK_SIZE } from "./constants";
import { geminiCliModels } from "./models";
import { validateImageUrl } from "./utils/image-utils";
import { GenerationConfigValidator } from "./helpers/generation-config-validator";
import { AutoModelSwitchingHelper } from "./helpers/auto-model-switching";

// Gemini API response types
interface GeminiCandidate {
	content?: {
		parts?: Array<{ text?: string }>;
	};
}

interface GeminiUsageMetadata {
	promptTokenCount?: number;
	candidatesTokenCount?: number;
}

interface GeminiResponse {
	response?: {
		candidates?: GeminiCandidate[];
		usageMetadata?: GeminiUsageMetadata;
	};
}

interface GeminiPart {
	text?: string;
	thought?: boolean; // For real thinking chunks from Gemini
	functionCall?: {
		name: string;
		args: object;
	};
	functionResponse?: {
		name: string;
		response: {
			result: string;
		};
	};
	inlineData?: {
		mimeType: string;
		data: string;
	};
	fileData?: {
		mimeType: string;
		fileUri: string;
	};
}

// Message content types - keeping only the local ones needed
interface TextContent {
	type: "text";
	text: string;
}

interface GeminiFormattedMessage {
	role: string;
	parts: GeminiPart[];
}

interface ProjectDiscoveryResponse {
	cloudaicompanionProject?: string;
}

// Type guard functions
function isTextContent(content: MessageContent): content is TextContent {
	return content.type === "text" && typeof content.text === "string";
}

/**
 * Handles communication with Google's Gemini API through the Code Assist endpoint.
 * Manages project discovery, streaming, and response parsing.
 */
export class GeminiApiClient {
	private env: Env;
	private authManager: AuthManager;
	private credentialManager: CredentialManager;
	private autoSwitchHelper: AutoModelSwitchingHelper;

	constructor(env: Env, authManager: AuthManager, credentialManager: CredentialManager) {
		this.env = env;
		this.authManager = authManager;
		this.credentialManager = credentialManager;
		this.autoSwitchHelper = new AutoModelSwitchingHelper(env);
	}

	/**
	 * Parses a server-sent event (SSE) stream from the Gemini API.
	 */
	private async *parseSSEStream(stream: ReadableStream<Uint8Array>): AsyncGenerator<GeminiResponse> {
		const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
		let buffer = "";
		let objectBuffer = "";

		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				if (objectBuffer) {
					try {
						yield JSON.parse(objectBuffer);
					} catch (e) {
						console.error("Error parsing final SSE JSON object:", e);
					}
				}
				break;
			}

			buffer += value;
			const lines = buffer.split("\n");
			buffer = lines.pop() || ""; // Keep the last, possibly incomplete, line.

			for (const line of lines) {
				if (line.trim() === "") {
					if (objectBuffer) {
						try {
							yield JSON.parse(objectBuffer);
						} catch (e) {
							console.error("Error parsing SSE JSON object:", e);
						}
						objectBuffer = "";
					}
				} else if (line.startsWith("data: ")) {
					objectBuffer += line.substring(6);
				}
			}
		}
	}

	/**
	 * Converts a message to Gemini format, handling both text and image content.
	 */
	private messageToGeminiFormat(msg: ChatMessage): GeminiFormattedMessage {
		const role = msg.role === "assistant" ? "model" : "user";

		// Handle tool call results (tool role in OpenAI format)
		if (msg.role === "tool") {
			return {
				role: "user",
				parts: [
					{
						functionResponse: {
							name: msg.tool_call_id || "unknown_function",
							response: {
								result: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)
							}
						}
					}
				]
			};
		}

		// Handle assistant messages with tool calls
		if (msg.role === "assistant" && msg.tool_calls && msg.tool_calls.length > 0) {
			const parts: GeminiPart[] = [];

			// Add text content if present
			if (typeof msg.content === "string" && msg.content.trim()) {
				parts.push({ text: msg.content });
			}

			// Add function calls
			for (const toolCall of msg.tool_calls) {
				if (toolCall.type === "function") {
					parts.push({
						functionCall: {
							name: toolCall.function.name,
							args: JSON.parse(toolCall.function.arguments)
						}
					});
				}
			}

			return { role: "model", parts };
		}

		if (typeof msg.content === "string") {
			// Simple text message
			return {
				role,
				parts: [{ text: msg.content }]
			};
		}

		if (Array.isArray(msg.content)) {
			// Multimodal message with text and/or images
			const parts: GeminiPart[] = [];

			for (const content of msg.content) {
				if (content.type === "text") {
					parts.push({ text: content.text });
				} else if (content.type === "image_url" && content.image_url) {
					const imageUrl = content.image_url.url;

					// Validate image URL
					const validation = validateImageUrl(imageUrl);
					if (!validation.isValid) {
						throw new Error(`Invalid image: ${validation.error}`);
					}

					if (imageUrl.startsWith("data:")) {
						// Handle base64 encoded images
						const [mimeType, base64Data] = imageUrl.split(",");
						const mediaType = mimeType.split(":")[1].split(";")[0];

						parts.push({
							inlineData: {
								mimeType: mediaType,
								data: base64Data
							}
						});
					} else {
						// Handle URL images
						// Note: For better reliability, you might want to fetch the image
						// and convert it to base64, as Gemini API might have limitations with external URLs
						parts.push({
							fileData: {
								mimeType: validation.mimeType || "image/jpeg",
								fileUri: imageUrl
							}
						});
					}
				}
			}

			return { role, parts };
		}

		// Fallback for unexpected content format
		return {
			role,
			parts: [{ text: String(msg.content) }]
		};
	}

	/**
	 * Validates if the model supports images.
	 */
	private validateImageSupport(modelId: string): boolean {
		return geminiCliModels[modelId]?.supportsImages || false;
	}

	/**
	 * Validates image content and format using the shared validation utility.
	 */
	private validateImageContent(imageUrl: string): boolean {
		const validation = validateImageUrl(imageUrl);
		return validation.isValid;
	}

	/**
	 * Stream content from Gemini API.
	 */
	async *streamContent(
		modelId: string,
		systemPrompt: string,
		messages: ChatMessage[],
		options?: {
			includeReasoning?: boolean;
			thinkingBudget?: number;
			tools?: Tool[];
			tool_choice?: ToolChoice;
			max_tokens?: number;
			temperature?: number;
			top_p?: number;
			stop?: string | string[];
			presence_penalty?: number;
			frequency_penalty?: number;
			seed?: number;
			response_format?: {
				type: "text" | "json_object";
			};
		}
	): AsyncGenerator<StreamChunk> {
		const contents = messages.map((msg) => this.messageToGeminiFormat(msg));

		if (systemPrompt) {
			contents.unshift({ role: "user", parts: [{ text: systemPrompt }] });
		}

		// Check if this is a thinking model and which thinking mode to use
		const isThinkingModel = geminiCliModels[modelId]?.thinking || false;
		const isRealThinkingEnabled = this.env.ENABLE_REAL_THINKING === "true";
		const isFakeThinkingEnabled = this.env.ENABLE_FAKE_THINKING === "true";
		const streamThinkingAsContent = this.env.STREAM_THINKING_AS_CONTENT === "true";
		const includeReasoning = options?.includeReasoning || false;

		const req = {
			thinking_budget: options?.thinkingBudget,
			tools: options?.tools,
			tool_choice: options?.tool_choice,
			max_tokens: options?.max_tokens,
			temperature: options?.temperature,
			top_p: options?.top_p,
			stop: options?.stop,
			presence_penalty: options?.presence_penalty,
			frequency_penalty: options?.frequency_penalty,
			seed: options?.seed,
			response_format: options?.response_format
		};

		// Use the validation helper to create a proper generation config
		const generationConfig = GenerationConfigValidator.createValidatedConfig(
			modelId,
			req,
			isRealThinkingEnabled,
			includeReasoning,
			this.env
		);

		const { tools, toolConfig } = GenerationConfigValidator.createValidateTools(req);

		// For thinking models with fake thinking (fallback when real thinking is not enabled or not requested)
		let needsThinkingClose = false;
		if (isThinkingModel && isFakeThinkingEnabled && !includeReasoning) {
			yield* this.generateReasoningOutput(modelId, messages, streamThinkingAsContent);
			needsThinkingClose = streamThinkingAsContent; // Only need to close if we streamed as content
		}

		const streamRequest = {
			model: modelId,
			request: {
				contents: contents,
				generationConfig,
				tools: tools,
				toolConfig
			}
		};

		yield* this.performStreamRequest(
			streamRequest,
			needsThinkingClose,
			false,
			includeReasoning && streamThinkingAsContent,
			modelId
		);
	}

	/**
	 * Generates reasoning output for thinking models.
	 */
	private async *generateReasoningOutput(
		modelId: string,
		messages: ChatMessage[],
		streamAsContent: boolean = false
	): AsyncGenerator<StreamChunk> {
		// Get the last user message to understand what the model should think about
		const lastUserMessage = messages.filter((msg) => msg.role === "user").pop();
		let userContent = "";

		if (lastUserMessage) {
			if (typeof lastUserMessage.content === "string") {
				userContent = lastUserMessage.content;
			} else if (Array.isArray(lastUserMessage.content)) {
				userContent = lastUserMessage.content
					.filter(isTextContent)
					.map((c) => c.text)
					.join(" ");
			}
		}

		// Generate reasoning text based on the user's question using constants
		const requestPreview = userContent.substring(0, 100) + (userContent.length > 100 ? "..." : "");

		if (streamAsContent) {
			// DeepSeek R1 style: stream thinking as content with <thinking> tags
			yield {
				type: "thinking_content",
				data: "<thinking>\n"
			};

			// Add a small delay after opening tag
			await new Promise((resolve) => setTimeout(resolve, REASONING_CHUNK_DELAY)); // Stream reasoning content in smaller chunks for more realistic streaming
			const reasoningTexts = REASONING_MESSAGES.map((msg) => msg.replace("{requestPreview}", requestPreview));
			const fullReasoningText = reasoningTexts.join("");

			// Split into smaller chunks for more realistic streaming
			// Try to split on word boundaries when possible for better readability
			const chunks: string[] = [];
			let remainingText = fullReasoningText;

			while (remainingText.length > 0) {
				if (remainingText.length <= THINKING_CONTENT_CHUNK_SIZE) {
					chunks.push(remainingText);
					break;
				}

				// Try to find a good break point (space, newline, punctuation)
				let chunkEnd = THINKING_CONTENT_CHUNK_SIZE;
				const searchSpace = remainingText.substring(0, chunkEnd + 10); // Look a bit ahead
				const goodBreaks = [" ", "\n", ".", ",", "!", "?", ";", ":"];

				for (const breakChar of goodBreaks) {
					const lastBreak = searchSpace.lastIndexOf(breakChar);
					if (lastBreak > THINKING_CONTENT_CHUNK_SIZE * 0.7) {
						// Don't make chunks too small
						chunkEnd = lastBreak + 1;
						break;
					}
				}

				chunks.push(remainingText.substring(0, chunkEnd));
				remainingText = remainingText.substring(chunkEnd);
			}

			for (const chunk of chunks) {
				yield {
					type: "thinking_content",
					data: chunk
				};

				// Add small delay between chunks
				await new Promise((resolve) => setTimeout(resolve, 50));
			}

			// Note: We don't close the thinking tag here - it will be closed when real content starts
		} else {
			// Original mode: stream as reasoning field
			const reasoningTexts = REASONING_MESSAGES.map((msg) => msg.replace("{requestPreview}", requestPreview));

			// Stream the reasoning text in chunks
			for (const reasoningText of reasoningTexts) {
				const reasoningData: ReasoningData = { reasoning: reasoningText };
				yield {
					type: "reasoning",
					data: reasoningData
				};

				// Add a small delay to simulate thinking time
				await new Promise((resolve) => setTimeout(resolve, REASONING_CHUNK_DELAY));
			}
		}
	}

	/**
	 * Performs the actual stream request with retry logic for 401 errors and auto model switching for rate limits.
	 */
private async performRequest(
    method: string,
    body: Record<string, unknown>,
    isStream: boolean = false
): Promise<Response> {
    const availableCredentials = this.credentialManager.getAvailableCredentials(body.model as string);

    if (availableCredentials.length === 0) {
        throw new Error("All credentials are currently rate-limited or expired.");
    }

    for (const credential of availableCredentials) {
        try {
            // This will now handle getting a valid token, either from cache or by refreshing.
            await this.authManager.initializeAuth(credential);
            console.log(`Using model: ${body.model as string}, Project ID: ${credential.projectId}`);

            const url = isStream
                ? `${CODE_ASSIST_ENDPOINT}/${CODE_ASSIST_API_VERSION}:${method}?alt=sse`
                : `${CODE_ASSIST_ENDPOINT}/${CODE_ASSIST_API_VERSION}:${method}`;
            
            const requestBody = {
                ...body,
                project: credential.projectId,
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.authManager.getAccessToken()}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status === 429) {
                console.log(`Credential ${credential.id} rate-limited. Trying next credential.`);
                this.credentialManager.markCredentialRateLimited(credential.id, body.model as string, 3600); // 1 hour
                continue; // Move to the next credential
            }

            if (response.status >= 500) {
                console.log(`Server error ${response.status}. Trying next credential.`);
                this.credentialManager.markCredentialRateLimited(credential.id, body.model as string, 3600); // 1 hour
                continue;
            }

            if (response.status === 401 || response.status === 403) {
                console.log(`Auth error ${response.status}. The token might be invalid. Trying next credential.`);
                // The token is likely invalid, so we mark it as expired and move on.
                credential.status = 'EXPIRED';
                credential.cachedStatus = 'EXPIRED';
                continue;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API call failed with status ${response.status}: ${errorText}`);
            }

            return response;
        } catch (error) {
            console.error(`Error with credential ${credential.id}:`, error);
            // On any other error, we also continue to the next credential.
            continue;
        }
    }

    throw new Error("All available credentials failed.");
}

	private async *performStreamRequest(
		streamRequest: unknown,
		needsThinkingClose: boolean = false,
		isRetry: boolean = false,
		realThinkingAsContent: boolean = false,
		originalModel?: string
	): AsyncGenerator<StreamChunk> {
		const response = await this.performRequest("streamGenerateContent", streamRequest as Record<string, unknown>, true);

		if (!response.body) {
			throw new Error("Response has no body");
		}

		let hasClosedThinking = false;
		let hasStartedThinking = false;

		for await (const jsonData of this.parseSSEStream(response.body)) {
			const candidate = jsonData.response?.candidates?.[0];

			if (candidate?.content?.parts) {
				for (const part of candidate.content.parts as GeminiPart[]) {
					// Handle real thinking content from Gemini
					if (part.thought === true && part.text) {
						const thinkingText = part.text;

						if (realThinkingAsContent) {
							// Stream as content with <thinking> tags (DeepSeek R1 style)
							if (!hasStartedThinking) {
								yield {
									type: "thinking_content",
									data: "<thinking>\n"
								};
								hasStartedThinking = true;
							}

							yield {
								type: "thinking_content",
								data: thinkingText
							};
						} else {
							// Stream as separate reasoning field
							yield {
								type: "real_thinking",
								data: thinkingText
							};
						}
					}
					// Check if text content contains <think> tags (based on your original example)
					else if (part.text && part.text.includes("<think>")) {
						if (realThinkingAsContent) {
							// Extract thinking content and convert to our format
							const thinkingMatch = part.text.match(/<think>(.*?)<\/think>/s);
							if (thinkingMatch) {
								if (!hasStartedThinking) {
									yield {
										type: "thinking_content",
										data: "<thinking>\n"
									};
									hasStartedThinking = true;
								}

								yield {
									type: "thinking_content",
									data: thinkingMatch[1]
								};
							}

							// Extract any non-thinking coRecentent
							const nonThinkingContent = part.text.replace(/<think>.*?<\/think>/gs, "").trim();
							if (nonThinkingContent) {
								if (hasStartedThinking && !hasClosedThinking) {
									yield {
										type: "thinking_content",
										data: "\n</thinking>\n\n"
									};
									hasClosedThinking = true;
								}
								yield { type: "text", data: nonThinkingContent };
							}
						} else {
							// Stream thinking as separate reasoning field
							const thinkingMatch = part.text.match(/<think>(.*?)<\/think>/s);
							if (thinkingMatch) {
								yield {
									type: "real_thinking",
									data: thinkingMatch[1]
								};
							}

							// Stream non-thinking content as regular text
							const nonThinkingContent = part.text.replace(/<think>.*?<\/think>/gs, "").trim();
							if (nonThinkingContent) {
								yield { type: "text", data: nonThinkingContent };
							}
						}
					}
					// Handle regular content - only if it's not a thinking part and doesn't contain <think> tags
					else if (part.text && !part.thought && !part.text.includes("<think>")) {
						// Close thinking tag before first real content if needed
						if ((needsThinkingClose || (realThinkingAsContent && hasStartedThinking)) && !hasClosedThinking) {
							yield {
								type: "thinking_content",
								data: "\n</thinking>\n\n"
							};
							hasClosedThinking = true;
						}

						yield { type: "text", data: part.text };
					}
					// Handle function calls from Gemini
					else if (part.functionCall) {
						// Close thinking tag before function call if needed
						if ((needsThinkingClose || (realThinkingAsContent && hasStartedThinking)) && !hasClosedThinking) {
							yield {
								type: "thinking_content",
								data: "\n</thinking>\n\n"
							};
							hasClosedThinking = true;
						}

						const functionCallData: GeminiFunctionCall = {
							name: part.functionCall.name,
							args: part.functionCall.args
						};

						yield {
							type: "tool_code",
							data: functionCallData
						};
					}
					// Note: Skipping unknown part structures
				}
			}

			if (jsonData.response?.usageMetadata) {
				const usage = jsonData.response.usageMetadata;
				const usageData: UsageData = {
					inputTokens: usage.promptTokenCount || 0,
					outputTokens: usage.candidatesTokenCount || 0
				};
				yield {
					type: "usage",
					data: usageData
				};
			}
		}
	}

	/**
	 * Get a complete response from Gemini API (non-streaming).
	 */
	async getCompletion(
		modelId: string,
		systemPrompt: string,
		messages: ChatMessage[],
		options?: {
			includeReasoning?: boolean;
			thinkingBudget?: number;
			tools?: Tool[];
			tool_choice?: ToolChoice;
			max_tokens?: number;
			temperature?: number;
			top_p?: number;
			stop?: string | string[];
			presence_penalty?: number;
			frequency_penalty?: number;
			seed?: number;
			response_format?: {
				type: "text" | "json_object";
			};
		}
	): Promise<{
		content: string;
		usage?: UsageData;
		tool_calls?: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }>;
	}> {
		try {
			let content = "";
			let usage: UsageData | undefined;
			const tool_calls: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }> = [];

			// Collect all chunks from the stream
			for await (const chunk of this.streamContent(modelId, systemPrompt, messages, options)) {
				if (chunk.type === "text" && typeof chunk.data === "string") {
					content += chunk.data;
				} else if (chunk.type === "usage" && typeof chunk.data === "object") {
					usage = chunk.data as UsageData;
				} else if (chunk.type === "tool_code" && typeof chunk.data === "object") {
					const toolData = chunk.data as GeminiFunctionCall;
					tool_calls.push({
						id: `call_${crypto.randomUUID()}`,
						type: "function",
						function: {
							name: toolData.name,
							arguments: JSON.stringify(toolData.args)
						}
					});
				}
				// Skip reasoning chunks for non-streaming responses
			}

			return {
				content,
				usage,
				tool_calls: tool_calls.length > 0 ? tool_calls : undefined
			};
		} catch (error: unknown) {
			throw error;
		}
	}
}

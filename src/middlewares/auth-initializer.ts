import { createMiddleware } from "hono/factory";
import { AuthManager } from "../auth";
import { CredentialManager } from "../credential-manager";
import { Env } from "../types";

type Variables = {
	authManager: AuthManager;
	credentialManager: CredentialManager;
};

/**
 * Middleware to initialize and attach the AuthManager and CredentialManager to the context.
 */
export const authInitializer = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
	try {
		if (!c.env.GEMINI_CLI_KV2) {
			throw new Error("KV namespace GEMINI_CLI_KV2 is not bound.");
		}
		const authManager = new AuthManager(c.env);
		const credentialManager = new CredentialManager(c.env);
		c.set("authManager", authManager);
		c.set("credentialManager", credentialManager);
	} catch (error) {
		console.error("Failed to initialize managers:", error);
		return new Response("Internal Server Error: Could not initialize authentication or credential manager.", {
			status: 500
		});
	}
	await next();
});

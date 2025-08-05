import { Env, OAuth2Credentials, CredentialStatus } from "./types";
import { CredentialManager } from "./credential-manager";
import {
	CODE_ASSIST_ENDPOINT,
	CODE_ASSIST_API_VERSION,
	OAUTH_CLIENT_ID,
	OAUTH_CLIENT_SECRET,
	OAUTH_REFRESH_URL,
	TOKEN_BUFFER_TIME,
	KV_TOKEN_KEY
} from "./config";

// Auth-related interfaces
interface TokenRefreshResponse {
	access_token: string;
	expires_in: number;
}

interface CachedTokenData {
	access_token: string;
	expiry_date: number;
	cached_at: number;
}

interface TokenCacheInfo {
	cached: boolean;
	cached_at?: string;
	expires_at?: string;
	time_until_expiry_seconds?: number;
	is_expired?: boolean;
	message?: string;
	error?: string;
}

/**
 * Handles OAuth2 authentication and Google Code Assist API communication.
 * Manages token caching, refresh, and API calls.
 */
export class AuthManager {
	private env: Env;
	private credentialManager: CredentialManager;
	private accessToken: string | null = null;

	constructor(env: Env) {
		if (!env.GEMINI_CLI_KV2) {
			throw new Error("KV namespace GEMINI_CLI_KV2 is not bound.");
		}
		this.env = env;
		this.credentialManager = new CredentialManager(env);
	}

	/**
	 * Initializes authentication using a specific credential.
	 */
public async initializeAuth(credentialStatus: CredentialStatus): Promise<void> {
    const { id, credentials } = credentialStatus;

    try {
        // Try to get a cached token from KV storage
        const cachedTokenInfo = await this.getCachedTokenInfo(id);
        if (cachedTokenInfo.cached && cachedTokenInfo.access_token) {
            const timeUntilExpiry = new Date(cachedTokenInfo.expires_at!).getTime() - Date.now();
            if (timeUntilExpiry > TOKEN_BUFFER_TIME) {
                this.accessToken = cachedTokenInfo.access_token;
                console.log(`Using cached token, valid for ${Math.floor(timeUntilExpiry / 1000)} more seconds`);
                return;
            }
            console.log("Cached token expired or expiring soon");
        }

        // If no valid cached token, refresh the token
        console.log("No valid cached token found, refreshing...");
        await this.refreshCredential(id, credentials.refresh_token);
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`Failed to initialize authentication for credential ${id}:`, e);
        // We don't re-throw the error here, allowing the client to try the next credential.
        // Instead, we'll mark the credential as expired.
        const credential = this.credentialManager.getCredentialCycle().find(c => c.id === id);
        if (credential) {
            credential.status = 'EXPIRED';
        }
        throw new Error(`Authentication failed for credential ${id}: ${errorMessage}`);
    }
}

	/**
	 * Refresh the OAuth token and cache it in KV storage.
	 */
	public async refreshCredential(credentialId: string, refreshToken: string): Promise<void> {
		console.log("Refreshing OAuth token...");

		const refreshResponse = await fetch(OAUTH_REFRESH_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				client_id: OAUTH_CLIENT_ID,
				client_secret: OAUTH_CLIENT_SECRET,
				refresh_token: refreshToken,
				grant_type: "refresh_token"
			})
		});

if (!refreshResponse.ok) {
    const errorText = await refreshResponse.text();
    console.error("Token refresh failed:", errorText);
    const credential = this.credentialManager.getCredentialCycle().find(c => c.id === credentialId);
    if (credential) {
        credential.status = 'EXPIRED';
    }
    throw new Error(`Token refresh failed: ${errorText}`);
}

		const refreshData = (await refreshResponse.json()) as TokenRefreshResponse;
		this.accessToken = refreshData.access_token;

		// Calculate expiry time (typically 1 hour from now)
		const expiryTime = Date.now() + refreshData.expires_in * 1000;

		console.log("Token refreshed successfully");
		console.log(`New token expires in ${refreshData.expires_in} seconds`);

		// Cache the new token in KV storage
		await this.cacheTokenInKV(credentialId, refreshData.access_token, expiryTime);
	}

	/**
	 * Cache the access token in KV storage.
	 */
private async cacheTokenInKV(credentialId: string, accessToken: string, expiryDate: number): Promise<void> {
    try {
        const credential = this.credentialManager.getCredentialCycle().find(c => c.id === credentialId);
        const tokenData = {
            access_token: accessToken,
            expiry_date: expiryDate,
            cached_at: Date.now(),
            status: credential ? credential.status : 'VALID'
        };

        const cacheKey = `${KV_TOKEN_KEY}_${credentialId}`;
        // Cache for slightly less than the token expiry to be safe
        const ttlSeconds = Math.floor((expiryDate - Date.now()) / 1000) - 300; // 5 minutes buffer

        if (ttlSeconds > 0) {
            await this.env.GEMINI_CLI_KV2.put(cacheKey, JSON.stringify(tokenData), {
                expirationTtl: ttlSeconds
            });
            console.log(`Token cached in KV storage with TTL of ${ttlSeconds} seconds`);
        } else {
            console.log("Token expires too soon, not caching in KV");
        }
    } catch (kvError) {
        console.error("Failed to cache token in KV storage:", kvError);
        // Don't throw an error here as the token is still valid, just not cached
    }
}

	/**
	 * Clear cached token from KV storage.
	 */
	public async clearTokenCache(credentialId: string): Promise<void> {
		try {
			const cacheKey = `${KV_TOKEN_KEY}_${credentialId}`;
			await this.env.GEMINI_CLI_KV2.delete(cacheKey);
			console.log(`Cleared cached token for credential ${credentialId} from KV storage`);
		} catch (kvError) {
			console.log("Error clearing KV cache:", kvError);
		}
	}

	/**
	 * Get cached token info from KV storage.
	 */
public async getCachedTokenInfo(credentialId: string): Promise<TokenCacheInfo & { access_token?: string }> {
    try {
        const cacheKey = `${KV_TOKEN_KEY}_${credentialId}`;
        const cachedToken = await this.env.GEMINI_CLI_KV2.get(cacheKey, "json");
        if (cachedToken) {
            const tokenData = cachedToken as CachedTokenData & { status?: 'VALID' | 'EXPIRED' | 'RATE_LIMITED' };
            const timeUntilExpiry = tokenData.expiry_date - Date.now();
            const credential = this.credentialManager.getCredentialCycle().find(c => c.id === credentialId);
            if (credential && tokenData.status) {
                credential.status = tokenData.status;
            }

            return {
                cached: true,
                cached_at: new Date(tokenData.cached_at).toISOString(),
                expires_at: new Date(tokenData.expiry_date).toISOString(),
                time_until_expiry_seconds: Math.floor(timeUntilExpiry / 1000),
                is_expired: timeUntilExpiry < 0,
                access_token: tokenData.access_token,
            };
        }
        return { cached: false, message: "No token found in cache" };
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { cached: false, error: errorMessage };
    }
}


	/**
	 * Get the current access token.
	 */
	public getAccessToken(): string | null {
		return this.accessToken;
	}
}

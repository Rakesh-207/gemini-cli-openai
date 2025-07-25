import { Env, OAuth2Credentials, CredentialStatus } from './types';

export class CredentialManager {
    private credentials: CredentialStatus[] = [];
    private currentIndex = 0;

    constructor(env: Env) {
        // Logic to load all GCP_SERVICE_ACCOUNT_X from env
        for (const key in env) {
            if (key.startsWith('GCP_SERVICE_ACCOUNT_')) {
                try {
                    const creds = JSON.parse(env[key]);
                    this.credentials.push({
                        id: creds.project_id,
                        credentials: creds,
                        rateLimit: {},
                    });
                } catch (error) {
                    console.error(`Failed to parse credentials for ${key}:`, error);
                }
            }
        }
        if (this.credentials.length === 0) {
            console.warn("No GCP_SERVICE_ACCOUNT_X environment variables found. Authentication will not work.");
        }
    }

    public getAvailableCredentials(model: string): CredentialStatus[] {
        return this.credentials.filter(cred => {
            const rateLimitInfo = cred.rateLimit[model];
            if (!rateLimitInfo) {
                return true; // Not rate-limited if no info exists
            }
            // Check if the rate limit has expired
            if (rateLimitInfo.isRateLimited && rateLimitInfo.expiresAt && Date.now() >= rateLimitInfo.expiresAt) {
                // Reset the rate limit status
                rateLimitInfo.isRateLimited = false;
                rateLimitInfo.expiresAt = null;
                return true; // Now available
            }
            return !rateLimitInfo.isRateLimited;
        });
    }

    public markCredentialRateLimited(credentialId: string, model: string, durationSeconds: number): void {
        const credential = this.credentials.find(c => c.id === credentialId);
        if (credential) {
            const expiresAt = Date.now() + durationSeconds * 1000;
            credential.rateLimit[model] = {
                isRateLimited: true,
                expiresAt: expiresAt,
            };
            console.log(`Credential ${credentialId} for model ${model} is rate limited until ${new Date(expiresAt).toISOString()}`);

            // Optional: You can still use setTimeout to log when it expires, but the primary logic is now based on expiresAt timestamp
            setTimeout(() => {
                console.log(`Rate limit duration for ${credentialId} on model ${model} has passed.`);
                // The isRateLimited flag will be reset on the next getAvailableCredentials call
            }, durationSeconds * 1000);
        }
    }

    public getCurrentCredential(): CredentialStatus | null {
        if (this.credentials.length === 0) {
            return null;
        }
        // Return the last used credential, not the next one
        const lastIndex = (this.currentIndex + this.credentials.length - 1) % this.credentials.length;
        return this.credentials[lastIndex];
    }

    public getCredentialCycle(): CredentialStatus[] {
        return this.credentials;
    }
}

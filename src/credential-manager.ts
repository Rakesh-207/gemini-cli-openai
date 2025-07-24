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
                        id: creds.client_id,
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

    public getNextAvailableCredential(model: string): CredentialStatus | null {
        // Cyclical selection logic that skips rate-limited credentials for the given model
        const startIndex = this.currentIndex;
        do {
            const credential = this.credentials[this.currentIndex];
            this.currentIndex = (this.currentIndex + 1) % this.credentials.length;
            if (!credential.rateLimit[model] || !credential.rateLimit[model].isRateLimited) {
                return credential;
            }
        } while (this.currentIndex !== startIndex);
        return null;
    }

    public markCredentialRateLimited(credentialId: string, model: string, durationSeconds: number): void {
        // Logic to mark a credential as rate-limited for a specific model
        const credential = this.credentials.find(c => c.id === credentialId);
        if (credential) {
            credential.rateLimit[model] = {
                isRateLimited: true,
                expiresAt: Date.now() + durationSeconds * 1000,
            };
            setTimeout(() => {
                credential.rateLimit[model] = {
                    isRateLimited: false,
                    expiresAt: null,
                };
            }, durationSeconds * 1000);
        }
    }

    public getCurrentCredential(): CredentialStatus | null {
        if (this.credentials.length === 0) {
            return null;
        }
        return this.credentials[this.currentIndex];
    }
}

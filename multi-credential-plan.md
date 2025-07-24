# Plan for Implementing Multi-Credential Support with Rate Limiting

This document outlines the plan to modify the application to support multiple OAuth2 credentials, with a cyclical selection mechanism and rate limiting for different Gemini models.

## 1. Credential Storage and Management

### 1.1. Environment Variable Configuration

We will move from a single `GCP_SERVICE_ACCOUNT` environment variable to a numbered sequence of variables to support multiple credentials:

-   `GCP_SERVICE_ACCOUNT_1`
-   `GCP_SERVICE_ACCOUNT_2`
-   `GCP_SERVICE_ACCOUNT_3`
-   ...and so on.

Each variable will contain the JSON object for a single OAuth2 credential.

### 1.2. `Env` Interface Update

The `Env` interface in `src/types.ts` will be updated to reflect this change. We will use a dynamic approach to capture all `GCP_SERVICE_ACCOUNT_` prefixed variables.

## 2. Centralized AuthManager and Middleware

### 2.1. The Root Cause of the KV Error

The core issue is that the `AuthManager` was being instantiated within the route handler, which does not have direct access to the Cloudflare KV namespace binding (`GEMINI_CLI_KV`). This resulted in the `TypeError: Cannot read properties of undefined (reading 'put')` because the KV namespace was `undefined`.

### 2.2. Solution: Centralized Initialization via Middleware

To resolve this, we will create a new middleware to centralize the initialization of the `AuthManager`.

-   A new middleware will be created in `src/middlewares/auth.ts` (or a new file).
-   This middleware will be responsible for creating a single instance of the `AuthManager` when the application starts.
-   The `AuthManager` will be instantiated with the correct environment and KV bindings.
-   The `AuthManager` instance will be attached to the application context (e.g., `c.set('authManager', authManager)`).
-   This middleware will be applied to all routes that require authentication.

## 3. `AuthManager` Modifications

The existing `AuthManager` class will be refactored to work with the `CredentialManager`.

-   The `AuthManager` will no longer be instantiated in the route handlers. Instead, it will be accessed from the application context.
-   The `initializeAuth` method will be updated to work with the `CredentialManager` to get a credential and its corresponding token.
-   The token refresh logic in `refreshAndCacheToken` will be updated to handle the refreshing of tokens for each credential individually.

## 4. Rate Limiting

### 4.1. Rate Limit Error Handling

The `callEndpoint` method in `src/auth.ts` will be updated to:

-   Catch API errors that indicate a rate limit has been reached (e.g., a 429 status code).
-   When a rate limit error is detected, it will notify the `CredentialManager`, specifying the credential and the model that was being used.

### 4.2. Cyclical Credential Selection

The `CredentialManager` will implement a cyclical selection algorithm. When a credential is marked as rate-limited for a specific model, it will be skipped for that model until the rate limit period expires. The `CredentialManager` will then select the next available credential in the cycle.

## 5. KV Store Updates

The current KV store implementation caches a single token. This will be updated to cache tokens for each credential.

-   The cache key will be made unique for each credential, for example, by using the `client_id` from the credential or a hash of the credential as part of the key. This will prevent token conflicts between different credentials.

## 6. Proactive Error Handling & Validation

To make the application more robust, we will add the following:

-   **KV Namespace Check:** The `AuthManager` will check if the KV namespace is available upon initialization and throw a clear, descriptive error if it's not.
-   **Credential Loading:** The `CredentialManager` will log a warning if no credentials are found in the environment variables.
-   **Improved Logging:** We will add more detailed logging to the authentication and credential management processes to make future debugging easier.

## 7. Testing

A comprehensive testing strategy will be developed to ensure the new system is working correctly. This will include:

-   Unit tests for the `CredentialManager` class.
-   Integration tests to verify the end-to-end authentication flow with multiple credentials.
-   Tests to simulate rate limit errors and verify that the credential cycling and rate limit removal mechanisms are working as expected.
-   Tests for the new middleware to ensure the `AuthManager` is correctly initialized and attached to the context.

## 8. Implementation Steps

The implementation will be carried out in the following steps:

1.  **Create `auth` middleware:** Create a new middleware to initialize the `AuthManager` and attach it to the context.
2.  **Update `src/index.ts`:** Apply the new middleware to the relevant routes.
3.  **Refactor `src/routes/openai.ts`:** Modify the route handlers to use the `AuthManager` from the context.
4.  **Update `src/types.ts`:** Modify the `Env` interface and add new interfaces for rate limit tracking.
5.  **Create `CredentialManager`:** Implement the `CredentialManager` class with the logic for loading credentials, cyclical selection, and rate limit management.
6.  **Refactor `AuthManager`:** Update the `AuthManager` to use the `CredentialManager`.
7.  **Update `callEndpoint`:** Implement the rate limit error handling in `callEndpoint`.
8.  **Update KV Store Logic:** Modify the KV store logic to support caching tokens for multiple credentials.
9.  **Add Proactive Error Handling:** Implement the new error handling and validation checks.
10. **Testing:** Write and run a comprehensive suite of tests.

This updated plan provides a clear and robust roadmap for resolving the current issues and improving the overall stability of the application.

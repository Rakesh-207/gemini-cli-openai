# Plan: Graceful Rate-Limit Handling with Credential Cycling

This document outlines the plan to refactor the application to intelligently handle API rate limits, ensuring a seamless experience for the end user. We will achieve this by creating a robust retry mechanism that automatically cycles through available credentials when a rate limit is encountered.

---

### **1. The Problem: Unhandled 429 Errors**

The application currently streams 429 rate limit errors directly to the end user, which is a jarring and unprofessional experience. As seen in the `worker-logs.md`, when a credential hits its API quota, the application fails to handle the error gracefully. This not only disrupts the user's workflow but also fails to leverage the multi-credential architecture that was put in place to prevent this exact scenario.

---

### **2. Current Flawed Implementation**

While the `AuthManager` in `src/auth.ts` has a basic catch for 429 errors, it's not sufficient. The core issue is that the error is not being propagated in a way that allows the `GeminiApiClient` to react. The `callEndpoint` method in `AuthManager` is too generic, and the responsibility for handling API-specific errors should lie with the `GeminiApiClient`.

---

### **3. The Solution: A Robust New Architecture**

To address this, we will implement a more robust and resilient architecture for handling API requests and rate limits.

#### **3.1. `src/types.ts` - Refining the Data Structure**

-   **Objective:** To create a more explicit and reliable way to track the rate-limit status of each credential.
-   **Action:**
    -   In the `CredentialStatus` interface, we will modify the `rateLimit` property to be more structured. It will now include an `isRateLimited` boolean flag and an `expiresAt` timestamp.

#### **3.2. `src/credential-manager.ts` - Smarter Credential Management**

-   **Objective:** To give the `GeminiApiClient` a clear and efficient way to get a list of usable credentials.
-   **Action:**
    -   We will introduce a new public method, `getAvailableCredentials(model: string)`, which will return an array of all credentials that are not currently rate-limited for the specified model.
    -   We will refactor the `markCredentialRateLimited` method to be more precise. It will now set the `isRateLimited` flag to `true` and use a `setTimeout` to reset it to `false` after the rate-limit period has expired.

#### **3.3. `src/auth.ts` - Streamlining the `AuthManager`**

-   **Objective:** To centralize all API call logic within the `GeminiApiClient` for better separation of concerns.
-   **Action:**
    -   The `callEndpoint` method will be completely removed from the `AuthManager`. Its responsibilities will be absorbed by the `GeminiApiClient`.

#### **3.4. `src/gemini-client.ts` - The Core of the Solution**

-   **Objective:** To implement a robust, self-healing mechanism for handling API requests and rate limits.
-   **Action:**
    -   A new private method, `performRequest`, will be created to handle the logic of making a single API call.
    -   The `streamContent` and `getCompletion` methods will be refactored to include a new retry loop. This loop will be the heart of the solution.
    -   Inside the loop, the `credentialManager.getAvailableCredentials()` method will be called to get a fresh list of available credentials for each attempt.
    -   The loop will then iterate through these credentials, using `performRequest` to make the API call.
    -   If a 429 error is encountered, the `credentialManager.markCredentialRateLimited()` method will be called, and the loop will seamlessly move on to the next available credential.
    -   If all credentials are exhausted, a clear and informative error will be thrown.

---

### **4. Benefits of the New Approach**

The new architecture will provide a seamless and professional user experience by eliminating the jarring 429 errors. The new implementation will be more resilient and easier to maintain, as the error handling and credential management logic will be centralized and more robust.

---

### **5. Visualizing the New Flow**

Here is a Mermaid diagram that illustrates the new, more robust flow of control:

```mermaid
sequenceDiagram
    participant User
    participant RouteHandler
    participant GeminiApiClient
    participant CredentialManager
    participant GoogleAPI

    User->>+RouteHandler: /v1/chat/completions
    RouteHandler->>+GeminiApiClient: streamContent()
    GeminiApiClient->>+CredentialManager: getAvailableCredentials()
    CredentialManager-->>-GeminiApiClient: [Credential1, Credential2]
    GeminiApiClient->>+GoogleAPI: API Request with Credential1
    GoogleAPI-->>-GeminiApiClient: 429 Rate Limit Error
    GeminiApiClient->>+CredentialManager: markCredentialRateLimited(Credential1)
    GeminiApiClient->>+GoogleAPI: API Request with Credential2
    GoogleAPI-->>-GeminiApiClient: Success (200 OK)
    GeminiApiClient-->>-RouteHandler: Stream Response
    RouteHandler-->>-User: Stream Response

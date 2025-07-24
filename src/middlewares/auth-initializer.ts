import { createMiddleware } from "hono/factory";
import { AuthManager } from "../auth";
import { Env } from "../types";

type Variables = {
  authManager: AuthManager;
};

/**
 * Middleware to initialize and attach the AuthManager to the context.
 */
export const authInitializer = createMiddleware<{ Bindings: Env, Variables: Variables }>(async (c, next) => {
  try {
    if (!c.env.GEMINI_CLI_KV2) {
      throw new Error("KV namespace GEMINI_CLI_KV2 is not bound.");
    }
    const authManager = new AuthManager(c.env);
    c.set("authManager", authManager);
  } catch (error) {
    console.error("Failed to initialize AuthManager:", error);
    return new Response("Internal Server Error: Could not initialize authentication manager.", { status: 500 });
  }
  await next();
});

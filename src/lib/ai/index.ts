import type { ZodTypeAny, z } from "zod";
import { runAnthropicResearchCall } from "./anthropicProvider";
import { runPerplexityResearchCall } from "./perplexityProvider";

export type AIProvider = "perplexity" | "anthropic";

export function getAIProvider(): AIProvider {
  const raw = process.env.AI_PROVIDER?.trim().toLowerCase();
  return raw === "anthropic" ? "anthropic" : "perplexity";
}

/**
 * Runs one research call against the configured provider (Perplexity Sonar by default,
 * Anthropic/Claude as a switchable alternative via AI_PROVIDER=anthropic), and parses +
 * validates the result against the given Zod schema.
 */
export async function runResearchCall<T extends ZodTypeAny>(params: {
  system: string;
  prompt: string;
  schema: T;
  maxTokens?: number;
}): Promise<z.infer<T>> {
  return getAIProvider() === "anthropic"
    ? runAnthropicResearchCall(params)
    : runPerplexityResearchCall(params);
}

export { AIConfigError, AIBillingError } from "./errors";

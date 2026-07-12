import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam, TextBlock } from "@anthropic-ai/sdk/resources/messages";
import type { ZodTypeAny, z } from "zod";

const MODEL = "claude-opus-4-8";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY ist nicht gesetzt. Bitte in .env eintragen (siehe .env.example).",
    );
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

function stripJsonFences(raw: string): string {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/i, "").replace(/```\s*$/, "");
  }
  // Some responses may include leading prose before the JSON object/array — grab the outermost braces.
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");
  const starts = [firstBrace, firstBracket].filter((i) => i >= 0);
  if (starts.length > 0) {
    const start = Math.min(...starts);
    const isArray = text[start] === "[";
    const end = isArray ? text.lastIndexOf("]") : text.lastIndexOf("}");
    if (end > start) {
      text = text.slice(start, end + 1);
    }
  }
  return text.trim();
}

/**
 * Runs one research call against Claude with the web-search tool enabled,
 * resuming automatically on `pause_turn` (the server-side tool loop's own
 * iteration cap), then parses + validates the final text as JSON.
 */
export async function runResearchCall<T extends ZodTypeAny>(params: {
  system: string;
  prompt: string;
  schema: T;
  maxTokens?: number;
}): Promise<z.infer<T>> {
  const client = getClient();
  const maxTokens = params.maxTokens ?? 8000;

  let messages: MessageParam[] = [{ role: "user", content: params.prompt }];
  let finalText = "";

  for (let i = 0; i < 4; i++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system: params.system,
      thinking: { type: "adaptive" },
      tools: [
        {
          type: "web_search_20260209" as const,
          name: "web_search",
          max_uses: 8,
        },
      ],
      messages,
    });

    if (response.stop_reason === "refusal") {
      throw new Error("Anfrage wurde von Claude aus Sicherheitsgründen abgelehnt.");
    }

    if (response.stop_reason === "pause_turn") {
      messages = [
        { role: "user", content: params.prompt },
        { role: "assistant", content: response.content },
      ];
      continue;
    }

    finalText = response.content
      .filter((b): b is TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    break;
  }

  if (!finalText) {
    throw new Error("Keine Antwort von Claude erhalten (leerer Text nach Recherche-Loop).");
  }

  const cleaned = stripJsonFences(finalText);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Antwort war kein valides JSON: ${cleaned.slice(0, 300)}`);
  }

  const result = params.schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Schema-Validierung fehlgeschlagen: ${result.error.message}`);
  }

  return result.data;
}

export const CLAUDE_MODEL = MODEL;

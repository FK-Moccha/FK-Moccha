import type { ZodTypeAny, z } from "zod";
import { AIBillingError, AIConfigError } from "./errors";
import { extractJson, sanitizeBookingLinks } from "./jsonExtract";

const PPLX_BASE_URL = "https://api.perplexity.ai";
const DEFAULT_MODEL = "sonar";
const DEFAULT_SEARCH_CONTEXT_SIZE = "low";

interface PerplexityChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  citations?: unknown;
  search_results?: Array<{ url?: string }>;
}

/**
 * Runs one research call against Perplexity's Sonar API. Web search is built into the
 * model itself (no separate tool declaration), and the response's `citations` array is
 * used to reject any `bookingLink` the model didn't actually get from a real source —
 * see sanitizeBookingLinks in ./jsonExtract.
 */
export async function runPerplexityResearchCall<T extends ZodTypeAny>(params: {
  system: string;
  prompt: string;
  schema: T;
  maxTokens?: number;
}): Promise<z.infer<T>> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new AIConfigError(
      "API-Key fehlt — trage deinen Perplexity-API-Key als PERPLEXITY_API_KEY in die .env-Datei " +
        "ein (siehe README, Schritt (d): „.env-Datei anlegen — API-Key eintragen“).",
    );
  }

  const model = process.env.PPLX_MODEL?.trim() || DEFAULT_MODEL;
  const searchContextSize =
    process.env.PPLX_SEARCH_CONTEXT_SIZE?.trim() || DEFAULT_SEARCH_CONTEXT_SIZE;

  let response: Response;
  try {
    response = await fetch(`${PPLX_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: params.system },
          { role: "user", content: params.prompt },
        ],
        web_search_options: { search_context_size: searchContextSize },
        max_tokens: params.maxTokens ?? 4000,
        temperature: 0.2,
      }),
    });
  } catch (err) {
    throw new Error(
      `Perplexity-API war nicht erreichbar: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (response.status === 401) {
    throw new AIConfigError(
      "Perplexity hat den API-Key abgelehnt (ungültiger PERPLEXITY_API_KEY). Prüfe den Wert in " +
        "deiner .env-Datei — neue Keys erstellst du unter perplexity.ai/settings/api.",
    );
  }
  if (response.status === 402) {
    throw new AIBillingError(
      "Kein API-Guthaben — bitte unter perplexity.ai/settings/api aufladen.",
    );
  }
  if (response.status === 429) {
    throw new Error(
      "Perplexity-API ist gerade überlastet oder das Rate-Limit wurde erreicht (429). " +
        "Versuche es in ein paar Minuten erneut.",
    );
  }
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Perplexity-API-Fehler (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as PerplexityChatResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Leere Antwort von Perplexity erhalten.");
  }

  const citations = Array.isArray(data.citations)
    ? data.citations.filter((c): c is string => typeof c === "string")
    : (data.search_results ?? [])
        .map((r) => r.url)
        .filter((u): u is string => typeof u === "string");

  const cleaned = extractJson(content);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Antwort war kein valides JSON: ${cleaned.slice(0, 300)}`);
  }

  const sanitized = sanitizeBookingLinks(parsed, citations);
  const result = params.schema.safeParse(sanitized);
  if (!result.success) {
    throw new Error(`Schema-Validierung fehlgeschlagen: ${result.error.message}`);
  }

  return result.data;
}

export const PERPLEXITY_DEFAULT_MODEL = DEFAULT_MODEL;

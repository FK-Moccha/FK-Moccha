/** Strips markdown code fences and any leading/trailing prose, leaving just the outermost JSON value. */
export function extractJson(raw: string): string {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/i, "").replace(/```\s*$/, "");
  }
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

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Nulls out any `bookingLink` field whose URL isn't backed by one of the given source
 * citations, so we never surface a link the model invented instead of one it actually found.
 * A missing citation list (e.g. no sources returned) leaves the data untouched.
 */
export function sanitizeBookingLinks(value: unknown, citations: string[]): unknown {
  const allowedHosts = new Set(
    citations.map(hostnameOf).filter((h): h is string => h !== null),
  );
  if (allowedHosts.size === 0) return value;

  function walk(node: unknown): unknown {
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(node as Record<string, unknown>)) {
        if (key === "bookingLink" && typeof val === "string") {
          const host = hostnameOf(val);
          out[key] = host && allowedHosts.has(host) ? val : null;
        } else {
          out[key] = walk(val);
        }
      }
      return out;
    }
    return node;
  }

  return walk(value);
}

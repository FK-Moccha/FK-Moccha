/** Missing/invalid API key or other setup problem — the message is shown as-is in the dashboard. */
export class AIConfigError extends Error {}

/** The provider rejected the request for billing reasons (e.g. HTTP 402 — no credit). */
export class AIBillingError extends Error {}

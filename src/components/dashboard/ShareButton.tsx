"use client";

import { useState } from "react";

export function ShareButton({ tripId }: { tripId: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/trip/${tripId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Share-Link kopieren:", url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
    >
      {copied ? "✓ Link kopiert" : "🔗 Teilen"}
    </button>
  );
}

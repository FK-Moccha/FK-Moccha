"use client";

import { useState } from "react";
import type { ResearchCategory } from "@/lib/schemas";
import type { TripData } from "@/lib/tripData";

export function RegenerateButton({
  tripId,
  category,
  onDone,
}: {
  tripId: string;
  category: ResearchCategory;
  onDone: (trip: TripData) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      const data = await res.json();
      if (data.trip) onDone(data.trip);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={run}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-medium text-ink-soft transition hover:border-accent hover:text-accent disabled:opacity-50"
    >
      <span className={loading ? "animate-spin" : ""}>↻</span>
      {loading ? "Recherchiere..." : "Neu recherchieren"}
    </button>
  );
}

import { RESEARCH_CATEGORIES, type ResearchCategory } from "@/lib/schemas";
import { CATEGORY_LABELS } from "@/lib/researchCategories";
import type { TripData } from "@/lib/tripData";

const ICONS: Record<ResearchCategory, string> = {
  flights: "✈️",
  hotels: "🏨",
  activities: "🎯",
  transfer: "🚗",
  restaurants: "🍽️",
  itinerary: "🗓️",
  budget: "💶",
  insiderTips: "💡",
};

function stateFor(trip: TripData, category: ResearchCategory, activeIndex: number, index: number) {
  if (trip[category] !== null) return "done";
  if (trip.researchErrors[category]) return "error";
  if (index === activeIndex) return "active";
  return "pending";
}

export function LoadingScreen({ trip }: { trip: TripData }) {
  const activeIndex = RESEARCH_CATEGORIES.findIndex(
    (c) => trip[c] === null && !trip.researchErrors[c],
  );

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-10 px-4 py-20 text-center">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {trip.briefing.destination}
        </p>
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Ich recherchiere deine Reise...
        </h1>
        <p className="mt-3 text-ink-soft">
          Das kann ein bis zwei Minuten dauern — ich durchsuche aktuelle Preise, Verfügbarkeiten und
          Bewertungen für dich.
        </p>
      </div>

      <ul className="flex w-full flex-col gap-2.5">
        {RESEARCH_CATEGORIES.map((category, index) => {
          const state = stateFor(trip, category, activeIndex, index);
          return (
            <li
              key={category}
              className={`flex items-center gap-4 rounded-xl border px-5 py-3.5 text-left transition-all duration-300 ${
                state === "active"
                  ? "border-accent bg-accent-soft"
                  : state === "done"
                    ? "border-line bg-card"
                    : state === "error"
                      ? "border-line bg-stone-soft"
                      : "border-line/60 bg-card/50 opacity-60"
              }`}
            >
              <span className="text-xl">{ICONS[category]}</span>
              <span className="flex-1 font-medium text-ink">{CATEGORY_LABELS[category]}</span>
              {state === "done" && <span className="text-teal">✓ Fertig</span>}
              {state === "active" && (
                <span className="flex items-center gap-2 text-sm text-accent">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                  läuft...
                </span>
              )}
              {state === "error" && (
                <span className="text-sm text-ink-faint">⚠ mit Hinweis</span>
              )}
              {state === "pending" && <span className="text-sm text-ink-faint">wartet</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

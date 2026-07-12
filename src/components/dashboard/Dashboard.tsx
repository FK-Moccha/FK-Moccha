"use client";

import { useState } from "react";
import Link from "next/link";
import { Hero } from "./Hero";
import { ShareButton } from "./ShareButton";
import { OverviewTab } from "./tabs/OverviewTab";
import { FlightsTab } from "./tabs/FlightsTab";
import { HotelsTab } from "./tabs/HotelsTab";
import { ActivitiesTab } from "./tabs/ActivitiesTab";
import { ItineraryTab } from "./tabs/ItineraryTab";
import { BudgetTab } from "./tabs/BudgetTab";
import { TipsTab } from "./tabs/TipsTab";
import type { TripData } from "@/lib/tripData";

const TABS = [
  { key: "overview", label: "Übersicht" },
  { key: "flights", label: "Flüge" },
  { key: "hotels", label: "Unterkünfte" },
  { key: "activities", label: "Aktivitäten" },
  { key: "itinerary", label: "Tagesplan" },
  { key: "budget", label: "Budget" },
  { key: "tips", label: "Insider-Tipps" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function Dashboard({
  trip: initialTrip,
  editable,
  onTripChange,
}: {
  trip: TripData;
  editable: boolean;
  onTripChange: (trip: TripData) => void;
}) {
  const [trip, setTrip] = useState(initialTrip);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  function handleTripChange(updated: TripData) {
    setTrip(updated);
    onTripChange(updated);
  }

  const tabProps = { trip, editable, onTripChange: handleTripChange };

  return (
    <div>
      <Hero trip={trip} />

      <div className="sticky top-0 z-10 border-b border-line bg-stone/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6">
          <nav className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.key
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:bg-stone-soft hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="hidden shrink-0 sm:block">
            <ShareButton tripId={trip.id} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        {editable && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm sm:hidden">
            <span className="text-ink-soft">Editier-Ansicht</span>
            <ShareButton tripId={trip.id} />
          </div>
        )}
        <div key={activeTab} className="animate-fade-in">
          {activeTab === "overview" && <OverviewTab {...tabProps} />}
          {activeTab === "flights" && <FlightsTab {...tabProps} />}
          {activeTab === "hotels" && <HotelsTab {...tabProps} />}
          {activeTab === "activities" && <ActivitiesTab {...tabProps} />}
          {activeTab === "itinerary" && <ItineraryTab {...tabProps} />}
          {activeTab === "budget" && <BudgetTab {...tabProps} />}
          {activeTab === "tips" && <TipsTab {...tabProps} />}
        </div>

        <div className="mt-16 border-t border-line pt-6 text-center text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">
            ← Zurück zur Übersicht aller Reisen
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { TripData } from "@/lib/tripData";
import { LoadingScreen } from "./LoadingScreen";
import { Dashboard } from "./Dashboard";

export function TripView({
  initialTrip,
  editable,
}: {
  initialTrip: TripData;
  editable: boolean;
}) {
  const [trip, setTrip] = useState(initialTrip);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const isPending = trip.status === "DRAFT" || trip.status === "RESEARCHING";
    if (!isPending) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/trips/${trip.id}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setTrip(data.trip);
      } catch {
        // transient network hiccup — the next poll tick will retry
      }
    }, 2500);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [trip.status, trip.id]);

  if (trip.status === "DRAFT" || trip.status === "RESEARCHING") {
    return <LoadingScreen trip={trip} />;
  }

  return <Dashboard trip={trip} editable={editable} onTripChange={setTrip} />;
}

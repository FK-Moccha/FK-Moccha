import type { Trip } from "@/generated/prisma/client";
import {
  tripBriefingSchema,
  type ActivitiesResult,
  type BudgetResult,
  type FlightsResult,
  type HotelsResult,
  type InsiderTipsResult,
  type ItineraryResult,
  type RestaurantsResult,
  type TransferResult,
  type ResearchCategory,
} from "@/lib/schemas";

export interface TripData {
  id: string;
  status: Trip["status"];
  createdAt: string;
  updatedAt: string;
  briefing: ReturnType<typeof tripBriefingSchema.parse>;
  flights: FlightsResult | null;
  hotels: HotelsResult | null;
  activities: ActivitiesResult | null;
  transfer: TransferResult | null;
  restaurants: RestaurantsResult | null;
  itinerary: ItineraryResult | null;
  budget: BudgetResult | null;
  insiderTips: InsiderTipsResult | null;
  researchErrors: Partial<Record<ResearchCategory, string>>;
}

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function serializeTrip(trip: Trip): TripData {
  return {
    id: trip.id,
    status: trip.status,
    createdAt: trip.createdAt.toISOString(),
    updatedAt: trip.updatedAt.toISOString(),
    briefing: tripBriefingSchema.parse(JSON.parse(trip.briefing)),
    flights: safeParseJson(trip.flights),
    hotels: safeParseJson(trip.hotels),
    activities: safeParseJson(trip.activities),
    transfer: safeParseJson(trip.transfer),
    restaurants: safeParseJson(trip.restaurants),
    itinerary: safeParseJson(trip.itinerary),
    budget: safeParseJson(trip.budget),
    insiderTips: safeParseJson(trip.insiderTips),
    researchErrors: safeParseJson(trip.researchErrors) ?? {},
  };
}

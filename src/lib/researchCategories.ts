import type { ResearchCategory } from "@/lib/schemas";

/** Client-safe category labels — kept separate from lib/research/pipeline.ts (server-only, pulls in Prisma). */
export const CATEGORY_LABELS: Record<ResearchCategory, string> = {
  flights: "Flüge",
  hotels: "Unterkünfte",
  activities: "Aktivitäten",
  transfer: "Transfer & Mobilität",
  restaurants: "Restaurants",
  itinerary: "Tagesplan",
  budget: "Budget",
  insiderTips: "Insider-Tipps",
};

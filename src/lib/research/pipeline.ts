import { prisma } from "@/lib/prisma";
import { runResearchCall } from "@/lib/anthropic";
import {
  categorySchemas,
  RESEARCH_CATEGORIES,
  tripBriefingSchema,
  type ResearchCategory,
  type TripBriefing,
} from "@/lib/schemas";
import { buildPromptSpec } from "./prompts";

export { CATEGORY_LABELS } from "@/lib/researchCategories";

/** Research a single category, retrying once with a simplified prompt on failure. */
export async function researchOneCategory(
  briefing: TripBriefing,
  category: ResearchCategory,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const schema = categorySchemas[category];

  for (const simplified of [false, true]) {
    try {
      const { system, prompt } = buildPromptSpec(category, briefing, simplified);
      const data = await runResearchCall({ system, prompt, schema });
      return { ok: true, data };
    } catch (err) {
      if (simplified) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message };
      }
      // fall through to the simplified retry
    }
  }
  return { ok: false, error: "Unbekannter Fehler bei der Recherche." };
}

/** Persists one category's result (or error) onto the trip row. */
async function saveCategoryResult(
  tripId: string,
  category: ResearchCategory,
  result: Awaited<ReturnType<typeof researchOneCategory>>,
) {
  const trip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });
  const errors = JSON.parse(trip.researchErrors) as Record<string, string>;

  if (result.ok) {
    delete errors[category];
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        [category]: JSON.stringify(result.data),
        researchErrors: JSON.stringify(errors),
      },
    });
  } else {
    errors[category] = result.error;
    await prisma.trip.update({
      where: { id: tripId },
      data: { researchErrors: JSON.stringify(errors) },
    });
  }
}

/** Regenerates a single category for an existing trip (used by the "Neu recherchieren" button). */
export async function regenerateCategory(tripId: string, category: ResearchCategory) {
  const trip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });
  const briefing = tripBriefingSchema.parse(JSON.parse(trip.briefing));
  const result = await researchOneCategory(briefing, category);
  await saveCategoryResult(tripId, category, result);
  return result;
}

/** Runs the full research pipeline for a trip, category by category, persisting progress as it goes. */
export async function runFullPipeline(tripId: string) {
  const trip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });
  const briefing = tripBriefingSchema.parse(JSON.parse(trip.briefing));

  await prisma.trip.update({
    where: { id: tripId },
    data: { status: "RESEARCHING" },
  });

  for (const category of RESEARCH_CATEGORIES) {
    const result = await researchOneCategory(briefing, category);
    await saveCategoryResult(tripId, category, result);
  }

  const finalTrip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });
  const errors = JSON.parse(finalTrip.researchErrors) as Record<string, string>;
  const allFailed = RESEARCH_CATEGORIES.every((c) => errors[c]);

  await prisma.trip.update({
    where: { id: tripId },
    data: { status: allFailed ? "ERROR" : "READY" },
  });
}

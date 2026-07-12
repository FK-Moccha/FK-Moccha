import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RESEARCH_CATEGORIES, type ResearchCategory } from "@/lib/schemas";
import { regenerateCategory } from "@/lib/research/pipeline";
import { serializeTrip } from "@/lib/tripData";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const category = body?.category as ResearchCategory | undefined;

  if (!category || !RESEARCH_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Unbekannte Kategorie." }, { status: 400 });
  }

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) {
    return NextResponse.json({ error: "Reise nicht gefunden." }, { status: 404 });
  }

  const result = await regenerateCategory(id, category);

  const updated = await prisma.trip.findUniqueOrThrow({ where: { id } });
  return NextResponse.json({
    ok: result.ok,
    error: result.ok ? null : result.error,
    trip: serializeTrip(updated),
  });
}

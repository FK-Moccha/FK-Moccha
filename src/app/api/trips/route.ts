import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tripBriefingSchema } from "@/lib/schemas";
import { runFullPipeline } from "@/lib/research/pipeline";

export async function GET() {
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      destination: true,
      origin: true,
      startDate: true,
      endDate: true,
      flexibleDates: true,
      adults: true,
      children: true,
      status: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ trips });
}

export async function POST(request: Request) {
  const createPassword = process.env.CREATE_TRIP_PASSWORD;
  if (createPassword) {
    const provided = request.headers.get("x-create-password");
    if (provided !== createPassword) {
      return NextResponse.json({ error: "Falsches Passwort." }, { status: 401 });
    }
  }

  const body = await request.json().catch(() => null);
  const parsed = tripBriefingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ungültiges Briefing.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const briefing = parsed.data;

  const trip = await prisma.trip.create({
    data: {
      destination: briefing.destination,
      origin: briefing.origin,
      startDate: briefing.startDate ? new Date(briefing.startDate) : null,
      endDate: briefing.endDate ? new Date(briefing.endDate) : null,
      flexibleDates: briefing.dateMode === "flexible",
      adults: briefing.adults,
      children: briefing.children,
      budgetTotal: briefing.budgetTotal,
      bestValue: briefing.bestValue,
      travelStyles: JSON.stringify(briefing.travelStyles),
      briefing: JSON.stringify(briefing),
      status: "DRAFT",
    },
  });

  // Fire-and-forget: the research pipeline runs in the background on this
  // Node process. The client polls GET /api/trips/[id] for progress. This
  // requires a long-lived Node server (not a serverless/edge function) —
  // see README for deployment notes.
  void runFullPipeline(trip.id).catch((err) => {
    console.error(`Recherche-Pipeline für Trip ${trip.id} fehlgeschlagen:`, err);
  });

  return NextResponse.json({ id: trip.id }, { status: 201 });
}

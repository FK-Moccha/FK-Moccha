import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runFullPipeline } from "@/lib/research/pipeline";

/** (Re-)starts the full research pipeline for a trip, e.g. after a total failure. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) {
    return NextResponse.json({ error: "Reise nicht gefunden." }, { status: 404 });
  }

  void runFullPipeline(id).catch((err) => {
    console.error(`Recherche-Pipeline für Trip ${id} fehlgeschlagen:`, err);
  });

  return NextResponse.json({ ok: true });
}

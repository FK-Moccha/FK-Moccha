import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeTrip } from "@/lib/tripData";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) {
    return NextResponse.json({ error: "Reise nicht gefunden." }, { status: 404 });
  }
  return NextResponse.json({ trip: serializeTrip(trip) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.trip.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

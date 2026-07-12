import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { serializeTrip } from "@/lib/tripData";
import { TripView } from "@/components/dashboard/TripView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) return { title: "Reise nicht gefunden" };
  return { title: `${trip.destination} — Reise-Dashboard` };
}

export default async function TripPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) notFound();

  return <TripView initialTrip={serializeTrip(trip)} editable={edit === "1"} />;
}

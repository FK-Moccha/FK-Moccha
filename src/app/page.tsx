import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TripCard } from "@/components/home/TripCard";
import { Button } from "@/components/shared/Button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Voyage
          </p>
          <h1 className="font-display text-4xl text-ink sm:text-5xl">Deine Reisen</h1>
          <p className="mt-3 max-w-md text-ink-soft">
            Ein KI-gestützter Reiseplaner, der von der Idee bis zum fertigen Dashboard alles für
            dich recherchiert.
          </p>
        </div>
        <Link href="/plan">
          <Button>+ Neue Reise planen</Button>
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line px-8 py-16 text-center">
          <p className="font-display text-xl text-ink">Noch keine Reisen geplant</p>
          <p className="mt-2 text-ink-soft">
            Starte deine erste Reiseplanung — es dauert nur ein paar Minuten.
          </p>
          <Link href="/plan" className="mt-6 inline-block">
            <Button>Los geht&apos;s</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 stagger sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

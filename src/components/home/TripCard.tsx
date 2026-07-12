import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { formatDateRange } from "@/lib/format";

type TripListItem = {
  id: string;
  destination: string;
  origin: string;
  startDate: Date | null;
  endDate: Date | null;
  flexibleDates: boolean;
  adults: number;
  children: number;
  status: "DRAFT" | "RESEARCHING" | "READY" | "ERROR";
  createdAt: Date;
};

const STATUS_LABEL: Record<TripListItem["status"], string> = {
  DRAFT: "Wird vorbereitet...",
  RESEARCHING: "Recherche läuft...",
  READY: "Fertig",
  ERROR: "Fehler bei der Recherche",
};

const STATUS_CLASS: Record<TripListItem["status"], string> = {
  DRAFT: "bg-stone-soft text-ink-faint",
  RESEARCHING: "bg-gold/20 text-[#7a5c22]",
  READY: "bg-teal-soft text-teal",
  ERROR: "bg-accent-soft text-accent-dark",
};

export function TripCard({ trip }: { trip: TripListItem }) {
  return (
    <Link href={`/trip/${trip.id}?edit=1`}>
      <Card className="flex h-full flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-ink">{trip.destination}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS[trip.status]}`}
          >
            {STATUS_LABEL[trip.status]}
          </span>
        </div>
        <p className="text-sm text-ink-soft">ab {trip.origin}</p>
        <p className="text-sm text-ink-faint">
          {formatDateRange(trip.startDate, trip.endDate)}
          {trip.flexibleDates ? " (flexibel)" : ""}
        </p>
        <p className="mt-auto text-xs text-ink-faint">
          {trip.adults} Erw.{trip.children > 0 ? ` · ${trip.children} Kinder` : ""}
        </p>
      </Card>
    </Link>
  );
}

import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { CategoryErrorNote } from "../CategoryErrorNote";
import { TabHeader } from "../TabHeader";
import { formatEUR } from "@/lib/format";
import type { TabProps } from "../types";

export function HotelsTab({ trip, editable, onTripChange }: TabProps) {
  const hotels = trip.hotels;
  const header = (
    <TabHeader
      title="Unterkünfte"
      editable={editable}
      tripId={trip.id}
      category="hotels"
      onTripChange={onTripChange}
    />
  );

  if (!hotels) {
    return (
      <div>
        {header}
        {trip.researchErrors.hotels ? (
          <CategoryErrorNote message={trip.researchErrors.hotels} />
        ) : (
          <p className="text-ink-soft">Noch keine Unterkünfte verfügbar.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="grid gap-6 sm:grid-cols-2">
      {hotels.options.map((hotel, i) => {
        const isBest = i === hotels.bestPickIndex;
        return (
          <Card key={`${hotel.name}-${i}`} className={`flex flex-col gap-4 p-6 ${isBest ? "ring-2 ring-accent" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg leading-snug text-ink">{hotel.name}</h3>
                <p className="text-sm text-ink-faint">{hotel.location}</p>
              </div>
              {hotel.ratingLabel && (
                <span className="shrink-0 rounded-full bg-teal-soft px-2.5 py-1 text-xs font-semibold text-teal">
                  ★ {hotel.ratingLabel}
                </span>
              )}
            </div>

            {isBest && <Badge tone="accent">Best-Pick</Badge>}

            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-ink">
                {hotel.pricePerNight !== null ? formatEUR(hotel.pricePerNight) : hotel.priceNote ?? "Preis auf Anfrage"}
              </span>
              <span className="text-sm text-ink-faint">/ Nacht</span>
            </div>
            {hotel.totalPrice !== null && (
              <p className="text-sm text-ink-soft">Gesamt: {formatEUR(hotel.totalPrice)}</p>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="mb-1 font-semibold text-teal">Pros</p>
                <ul className="flex flex-col gap-0.5 text-ink-soft">
                  {hotel.pros.map((p) => (
                    <li key={p}>+ {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-semibold text-accent">Cons</p>
                <ul className="flex flex-col gap-0.5 text-ink-soft">
                  {hotel.cons.map((c) => (
                    <li key={c}>− {c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {hotel.parkingInfo && (
              <p className="text-xs text-ink-faint">🚗 {hotel.parkingInfo}</p>
            )}
            {hotel.cancellationPolicy && (
              <p className="text-xs text-ink-faint">📋 {hotel.cancellationPolicy}</p>
            )}

            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="text-xs uppercase tracking-wide text-ink-faint">{hotel.source}</span>
              {hotel.bookingLink ? (
                <a
                  href={hotel.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark"
                >
                  Buchen ↗
                </a>
              ) : (
                <span className="text-xs text-ink-faint">kein Link</span>
              )}
            </div>
          </Card>
        );
      })}
      </div>
    </div>
  );
}

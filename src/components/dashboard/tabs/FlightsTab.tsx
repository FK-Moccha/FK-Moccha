import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { CategoryErrorNote } from "../CategoryErrorNote";
import { TabHeader } from "../TabHeader";
import { formatEUR } from "@/lib/format";
import type { TabProps } from "../types";

export function FlightsTab({ trip, editable, onTripChange }: TabProps) {
  const flights = trip.flights;

  if (!flights) {
    return (
      <div>
        <TabHeader
          title="Flüge"
          editable={editable}
          tripId={trip.id}
          category="flights"
          onTripChange={onTripChange}
        />
        {trip.researchErrors.flights ? (
          <CategoryErrorNote message={trip.researchErrors.flights} />
        ) : (
          <p className="text-ink-soft">Noch keine Flugdaten verfügbar.</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <TabHeader
        title="Flüge"
        editable={editable}
        tripId={trip.id}
        category="flights"
        onTripChange={onTripChange}
      />
      {flights.flexibilityNote && (
        <Card className="p-4 text-sm text-ink-soft">💡 {flights.flexibilityNote}</Card>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-stone-soft text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-3">Airline</th>
              <th className="px-4 py-3">Preis</th>
              <th className="px-4 py-3">Dauer</th>
              <th className="px-4 py-3">Direktflug</th>
              <th className="px-4 py-3">Gepäck</th>
              <th className="px-4 py-3">Buchen</th>
            </tr>
          </thead>
          <tbody>
            {flights.options.map((option, i) => {
              const isBest = i === flights.bestPickIndex;
              return (
                <tr
                  key={`${option.airline}-${i}`}
                  className={`border-b border-line last:border-0 ${isBest ? "bg-accent-soft" : "bg-card"}`}
                >
                  <td className="px-4 py-3.5 font-medium text-ink">
                    <div className="flex items-center gap-2">
                      {option.airline}
                      {isBest && <Badge tone="accent">Best-Pick</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-display text-base text-ink">
                    {option.price !== null ? formatEUR(option.price) : option.priceNote ?? "Preis auf Anfrage"}
                  </td>
                  <td className="px-4 py-3.5 text-ink-soft">{option.durationLabel}</td>
                  <td className="px-4 py-3.5 text-ink-soft">{option.direct ? "Ja" : "Nein"}</td>
                  <td className="px-4 py-3.5 text-ink-soft">{option.baggageInfo ?? "—"}</td>
                  <td className="px-4 py-3.5">
                    {option.bookingLink ? (
                      <a
                        href={option.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-dark"
                      >
                        Buchen ↗
                      </a>
                    ) : (
                      <span className="text-xs text-ink-faint">kein Link</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {flights.options[flights.bestPickIndex] && (
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Warum dieser Best-Pick?
          </p>
          <p className="mt-1.5 text-ink">{flights.bestPickReason}</p>
        </Card>
      )}
    </div>
  );
}

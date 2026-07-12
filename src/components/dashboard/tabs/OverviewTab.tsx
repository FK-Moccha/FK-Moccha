import { Card } from "@/components/shared/Card";
import { CategoryErrorNote } from "../CategoryErrorNote";
import { RegenerateButton } from "../RegenerateButton";
import { formatEUR } from "@/lib/format";
import type { TabProps } from "../types";
import { CATEGORY_LABELS } from "@/lib/researchCategories";

const BAR_COLORS = ["bg-accent", "bg-teal", "bg-gold", "bg-ink-faint", "bg-accent-dark"];

const BOOKING_ORDER = [
  { key: "flights" as const, label: "Flug buchen" },
  { key: "hotels" as const, label: "Unterkunft buchen" },
  { key: "activities" as const, label: "Aktivitäten & Touren reservieren" },
  { key: "transfer" as const, label: "Transfer organisieren" },
  { key: "restaurants" as const, label: "Restaurant-Reservierungen (optional)" },
];

export function OverviewTab({ trip, editable, onTripChange }: TabProps) {
  const bestPicks: Array<{ label: string; value: string | null }> = [
    {
      label: "Flug",
      value: trip.flights
        ? `${trip.flights.options[trip.flights.bestPickIndex]?.airline ?? "—"} · ${formatEUR(
            trip.flights.options[trip.flights.bestPickIndex]?.price ?? null,
          )}`
        : null,
    },
    {
      label: "Unterkunft",
      value: trip.hotels
        ? `${trip.hotels.options[trip.hotels.bestPickIndex]?.name ?? "—"}`
        : null,
    },
    {
      label: "Top-Aktivität",
      value: trip.activities?.options.find((a) => a.label === "must-do")?.title ?? null,
    },
  ];

  const items = trip.budget?.items ?? [];
  const total = trip.budget?.total ?? items.reduce((sum, i) => sum + (i.amount ?? 0), 0) ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-display text-2xl text-ink sm:text-3xl">Übersicht</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {bestPicks.map((pick) => (
          <Card key={pick.label} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Best-Pick · {pick.label}
            </p>
            <p className="mt-2 font-display text-xl text-ink">{pick.value ?? "Noch offen"}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl text-ink">Budget-Aufschlüsselung</h3>
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl text-accent">{formatEUR(total || null)}</span>
            {editable && (
              <RegenerateButton tripId={trip.id} category="budget" onDone={onTripChange} />
            )}
          </div>
        </div>
        {trip.researchErrors.budget && <CategoryErrorNote message={trip.researchErrors.budget} />}
        {items.length > 0 && (
          <div className="flex flex-col gap-3">
            {items.map((item, i) => {
              const value = item.amount ?? 0;
              const pct = total > 0 ? Math.max(3, Math.round((value / total) * 100)) : 0;
              return (
                <div key={item.category} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{item.category}</span>
                    <span className="text-ink-soft">
                      {item.amount !== null ? formatEUR(item.amount) : item.amountNote ?? "—"}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-deep">
                    <div
                      className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]} transition-all duration-700 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-xl text-ink">Transfer &amp; Mobilität</h3>
            {editable && (
              <RegenerateButton tripId={trip.id} category="transfer" onDone={onTripChange} />
            )}
          </div>
          {trip.researchErrors.transfer && (
            <CategoryErrorNote message={trip.researchErrors.transfer} />
          )}
          {trip.transfer && (
            <div className="flex flex-col gap-3 text-sm">
              <p className="text-ink">{trip.transfer.recommendation}</p>
              <div>
                <p className="mb-1 font-semibold text-ink-soft">Flughafen → Unterkunft</p>
                <ul className="flex flex-col gap-1">
                  {trip.transfer.airportToAccommodation.map((o) => (
                    <li key={o.mode} className="flex justify-between text-ink-soft">
                      <span>{o.mode}</span>
                      <span>{o.cost !== null ? formatEUR(o.cost) : o.costNote ?? "—"}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-semibold text-ink-soft">Vor Ort</p>
                <ul className="flex flex-col gap-1">
                  {trip.transfer.localMobility.map((o) => (
                    <li key={o.mode} className="flex justify-between text-ink-soft">
                      <span>{o.mode}</span>
                      <span>{o.cost !== null ? formatEUR(o.cost) : o.costNote ?? "—"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-xl text-ink">Restaurant-Tipps</h3>
            {editable && (
              <RegenerateButton tripId={trip.id} category="restaurants" onDone={onTripChange} />
            )}
          </div>
          {trip.researchErrors.restaurants && (
            <CategoryErrorNote message={trip.researchErrors.restaurants} />
          )}
          {trip.restaurants && (
            <ul className="flex flex-col gap-3 text-sm">
              {trip.restaurants.options.map((r) => (
                <li key={r.name}>
                  <p className="font-medium text-ink">
                    {r.name}
                    {r.priceRange ? (
                      <span className="ml-2 text-xs font-normal text-ink-faint">{r.priceRange}</span>
                    ) : null}
                  </p>
                  <p className="text-ink-soft">{r.description}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 font-display text-xl text-ink">Buchungsreihenfolge</h3>
        <ol className="flex flex-col gap-3">
          {BOOKING_ORDER.map((step, i) => (
            <li key={step.key} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-soft text-sm font-semibold text-teal">
                {i + 1}
              </span>
              <span className="pt-0.5 text-ink">
                {step.label}
                {trip.researchErrors[step.key] && (
                  <span className="ml-2 text-xs text-ink-faint">
                    (Hinweis: {CATEGORY_LABELS[step.key]} nicht vollständig recherchiert)
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

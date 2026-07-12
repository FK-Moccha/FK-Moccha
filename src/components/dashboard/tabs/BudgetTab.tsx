import { Card } from "@/components/shared/Card";
import { CategoryErrorNote } from "../CategoryErrorNote";
import { TabHeader } from "../TabHeader";
import { formatEUR } from "@/lib/format";
import type { TabProps } from "../types";

export function BudgetTab({ trip, editable, onTripChange }: TabProps) {
  const budget = trip.budget;
  const header = (
    <TabHeader
      title="Budget"
      editable={editable}
      tripId={trip.id}
      category="budget"
      onTripChange={onTripChange}
    />
  );

  if (!budget) {
    return (
      <div>
        {header}
        {trip.researchErrors.budget ? (
          <CategoryErrorNote message={trip.researchErrors.budget} />
        ) : (
          <p className="text-ink-soft">Noch keine Budget-Aufschlüsselung verfügbar.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-line bg-stone-soft px-6 py-4">
          <h3 className="font-display text-xl text-ink">Gesamtsumme</h3>
          <span className="font-display text-3xl text-accent">{formatEUR(budget.total)}</span>
        </div>
        <ul>
          {budget.items.map((item) => (
            <li
              key={item.category}
              className="flex items-center justify-between border-b border-line px-6 py-4 last:border-0"
            >
              <div>
                <p className="font-medium text-ink">{item.category}</p>
                {item.notes && <p className="text-sm text-ink-faint">{item.notes}</p>}
              </div>
              <span className="font-display text-lg text-ink">
                {item.amount !== null ? formatEUR(item.amount) : item.amountNote ?? "Preis auf Anfrage"}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {budget.savingTips.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-3 font-display text-xl text-ink">Sparoptionen</h3>
          <ul className="flex flex-col gap-2">
            {budget.savingTips.map((tip) => (
              <li key={tip} className="flex gap-2 text-ink-soft">
                <span className="text-teal">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      )}
      </div>
    </div>
  );
}

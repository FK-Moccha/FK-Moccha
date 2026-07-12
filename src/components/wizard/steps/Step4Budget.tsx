import type { WizardDraft } from "../wizardTypes";

const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function Step4Budget({
  draft,
  update,
}: {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className={`rounded-xl border border-line bg-card px-5 py-5 transition-opacity ${
          draft.bestValue ? "opacity-40" : ""
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-ink-soft">Gesamtbudget (Flug + Unterkunft)</span>
          <span className="font-display text-xl text-accent">
            {draft.budgetTotal ? euro.format(draft.budgetTotal) : "—"}
          </span>
        </div>
        <input
          type="range"
          min={200}
          max={10000}
          step={100}
          disabled={draft.bestValue}
          value={draft.budgetTotal ?? 1500}
          onChange={(e) => update({ budgetTotal: Number(e.target.value) })}
          className="w-full accent-accent"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-faint">
          <span>200 €</span>
          <span>10.000 €+</span>
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3">
        <input
          type="checkbox"
          checked={draft.bestValue}
          onChange={(e) => update({ bestValue: e.target.checked })}
          className="h-4 w-4 accent-accent"
        />
        <span className="text-sm text-ink">
          Lieber bestes Preis-Leistungs-Verhältnis als ein festes Budget
        </span>
      </label>
    </div>
  );
}

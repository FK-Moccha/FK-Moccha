import type { WizardDraft } from "../wizardTypes";

export function Step2Dates({
  draft,
  update,
}: {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Von</span>
          <input
            type="date"
            value={draft.startDate ?? ""}
            onChange={(e) => update({ startDate: e.target.value || null })}
            className="rounded-xl border border-line bg-card px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Bis</span>
          <input
            type="date"
            value={draft.endDate ?? ""}
            min={draft.startDate ?? undefined}
            onChange={(e) => update({ endDate: e.target.value || null })}
            className="rounded-xl border border-line bg-card px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
        </label>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-line bg-card px-4 py-3">
        <span className="text-sm text-ink">Ich bin bei den Daten flexibel</span>
        <button
          type="button"
          role="switch"
          aria-checked={draft.dateMode === "flexible"}
          onClick={() =>
            update({ dateMode: draft.dateMode === "flexible" ? "fixed" : "flexible" })
          }
          className={`relative h-6 w-11 rounded-full transition-colors ${
            draft.dateMode === "flexible" ? "bg-accent" : "bg-stone-deep"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              draft.dateMode === "flexible" ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {draft.dateMode === "flexible" && (
        <div className="flex items-center justify-between rounded-xl border border-line bg-card px-4 py-3 animate-fade-in">
          <span className="text-sm text-ink">Flexibilität</span>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 5, 7].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => update({ flexibleDays: n })}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  draft.flexibleDays === n
                    ? "border-accent bg-accent text-white"
                    : "border-line text-ink-soft hover:border-ink-faint"
                }`}
              >
                ±{n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

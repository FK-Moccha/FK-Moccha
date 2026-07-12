import type { WizardDraft } from "../wizardTypes";

export function Step1Destination({
  draft,
  update,
}: {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Reiseziel</span>
        <input
          autoFocus
          type="text"
          placeholder="z.B. Lissabon, Portugal"
          value={draft.destination}
          onChange={(e) => update({ destination: e.target.value })}
          className="rounded-xl border border-line bg-card px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Abflugort</span>
        <input
          type="text"
          placeholder="z.B. München"
          value={draft.origin}
          onChange={(e) => update({ origin: e.target.value })}
          className="rounded-xl border border-line bg-card px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
      </label>
      <label className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3">
        <input
          type="checkbox"
          checked={draft.openJaw}
          onChange={(e) => update({ openJaw: e.target.checked })}
          className="h-4 w-4 accent-accent"
        />
        <span className="text-sm text-ink">Gabelflug möglich (Hin- und Rückflug von unterschiedlichen Orten)</span>
      </label>
    </div>
  );
}

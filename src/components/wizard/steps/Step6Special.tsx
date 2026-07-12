import { Chip } from "@/components/shared/Chip";
import { ACCOMMODATION_TYPES, SPECIAL_REQUIREMENT_CHIPS } from "@/lib/schemas";
import type { WizardDraft } from "../wizardTypes";

export function Step6Special({
  draft,
  update,
}: {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
}) {
  function toggleChip(chip: string) {
    const has = draft.specialRequirementChips.includes(chip);
    update({
      specialRequirementChips: has
        ? draft.specialRequirementChips.filter((c) => c !== chip)
        : [...draft.specialRequirementChips, chip],
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2.5">
        {SPECIAL_REQUIREMENT_CHIPS.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            selected={draft.specialRequirementChips.includes(chip)}
            onClick={() => toggleChip(chip)}
          />
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Bevorzugte Unterkunftsart</span>
        <select
          value={draft.accommodationType}
          onChange={(e) => update({ accommodationType: e.target.value })}
          className="rounded-xl border border-line bg-card px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        >
          {ACCOMMODATION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Sonstige Wünsche (optional)</span>
        <textarea
          rows={3}
          placeholder="z.B. Nichtraucher-Zimmer, ruhige Lage, Nähe zum Strand..."
          value={draft.specialRequirementsText}
          onChange={(e) => update({ specialRequirementsText: e.target.value })}
          className="resize-none rounded-xl border border-line bg-card px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
      </label>
    </div>
  );
}

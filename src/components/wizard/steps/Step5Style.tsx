import { Chip } from "@/components/shared/Chip";
import { TRAVEL_STYLES } from "@/lib/schemas";
import type { WizardDraft } from "../wizardTypes";

export function Step5Style({
  draft,
  update,
}: {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
}) {
  function toggle(style: string) {
    const has = draft.travelStyles.includes(style);
    update({
      travelStyles: has
        ? draft.travelStyles.filter((s) => s !== style)
        : [...draft.travelStyles, style],
    });
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {TRAVEL_STYLES.map((style) => (
        <Chip
          key={style}
          label={style}
          selected={draft.travelStyles.includes(style)}
          onClick={() => toggle(style)}
        />
      ))}
    </div>
  );
}

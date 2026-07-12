import { Stepper } from "@/components/shared/Stepper";
import type { WizardDraft } from "../wizardTypes";

export function Step3Travelers({
  draft,
  update,
}: {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Stepper
        label="Erwachsene"
        value={draft.adults}
        min={1}
        onChange={(v) => update({ adults: v })}
      />
      <Stepper
        label="Kinder"
        value={draft.children}
        min={0}
        onChange={(v) => update({ children: v })}
      />
    </div>
  );
}

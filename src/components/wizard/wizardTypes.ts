export interface WizardDraft {
  destination: string;
  origin: string;
  openJaw: boolean;
  dateMode: "fixed" | "flexible";
  startDate: string | null;
  endDate: string | null;
  flexibleDays: number;
  adults: number;
  children: number;
  budgetTotal: number | null;
  bestValue: boolean;
  travelStyles: string[];
  accommodationType: string;
  specialRequirementChips: string[];
  specialRequirementsText: string;
}

export const initialDraft: WizardDraft = {
  destination: "",
  origin: "",
  openJaw: false,
  dateMode: "fixed",
  startDate: null,
  endDate: null,
  flexibleDays: 3,
  adults: 2,
  children: 0,
  budgetTotal: 1500,
  bestValue: false,
  travelStyles: [],
  accommodationType: "Egal",
  specialRequirementChips: [],
  specialRequirementsText: "",
};

export const TOTAL_STEPS = 6;

export function isStepValid(step: number, d: WizardDraft): boolean {
  switch (step) {
    case 1:
      return d.destination.trim().length > 1 && d.origin.trim().length > 1;
    case 2:
      return Boolean(d.startDate && d.endDate);
    case 3:
      return d.adults >= 1;
    case 4:
      return d.bestValue || (d.budgetTotal !== null && d.budgetTotal > 0);
    case 5:
      return d.travelStyles.length > 0;
    case 6:
      return true;
    default:
      return false;
  }
}

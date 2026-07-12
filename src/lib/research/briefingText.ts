import type { TripBriefing } from "@/lib/schemas";

/** Renders the briefing into a compact German prose block shared by every research prompt. */
export function briefingSummary(b: TripBriefing): string {
  const dates =
    b.dateMode === "fixed" && b.startDate && b.endDate
      ? `${b.startDate} bis ${b.endDate} (feste Daten)`
      : b.dateMode === "flexible" && b.startDate && b.endDate
        ? `${b.startDate} bis ${b.endDate}, flexibel um ±${b.flexibleDays} Tage`
        : "Flexibel, keine festen Daten";

  const budget = b.budgetTotal
    ? `${b.budgetTotal} € Gesamtbudget für Flug + Unterkunft`
    : "kein festes Budget";

  const specials = [
    ...b.specialRequirementChips,
    b.specialRequirementsText?.trim() || null,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    `Ziel: ${b.destination}`,
    `Abflug von: ${b.origin}${b.openJaw ? " (Gabelflug erwünscht, falls sinnvoll)" : ""}`,
    `Reisedaten: ${dates}`,
    `Reisegruppe: ${b.adults} Erwachsene, ${b.children} Kinder`,
    `Budget: ${budget}${b.bestValue ? " — bestes Preis-Leistungs-Verhältnis ist wichtiger als der niedrigste Preis" : ""}`,
    `Reisestil: ${b.travelStyles.join(", ")}`,
    `Bevorzugte Unterkunftsart: ${b.accommodationType}`,
    specials ? `Besonderheiten: ${specials}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export const JSON_ONLY_RULE =
  "Antworte AUSSCHLIESSLICH mit einem validen JSON-Objekt, exakt im unten beschriebenen Format. " +
  "Keine Markdown-Code-Fences, kein Fließtext davor oder danach, keine Kommentare. " +
  "Wenn ein Preis oder Link nicht in den Suchergebnissen auffindbar ist, setze das Preisfeld auf null und " +
  "trage in das zugehörige *Note-Feld 'Preis auf Anfrage / prüfen' ein — erfinde niemals Preise oder Links. " +
  "Buchungslinks müssen echte URLs aus den Suchergebnissen sein.";

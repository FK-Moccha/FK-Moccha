import type { TripBriefing, ResearchCategory } from "@/lib/schemas";
import { briefingSummary, JSON_ONLY_RULE } from "./briefingText";

const SYSTEM_BASE =
  "Du bist ein erfahrener, akribischer Reiseplaner-Rechercheassistent. Du nutzt das Web-Search-Tool, " +
  "um aktuelle, reale Preise, Verfügbarkeiten und Buchungslinks zu finden. Du recherchierst gründlich " +
  "(mehrere Suchen, verschiedene Quellen) bevor du antwortest. Du hältst dich strikt an das geforderte " +
  "JSON-Ausgabeformat und übernimmst keine Preise oder Links, die nicht aus echten Suchergebnissen stammen.";

interface PromptSpec {
  system: string;
  prompt: string;
}

function buildPrompt(
  briefing: TripBriefing,
  instructions: string,
  jsonShape: string,
  simplified = false,
): string {
  return [
    `Reise-Briefing:\n${briefingSummary(briefing)}`,
    "",
    instructions,
    "",
    simplified
      ? "Halte die Recherche diesmal knapper (weniger Suchanfragen) und liefere trotzdem valides JSON."
      : "",
    "",
    JSON_ONLY_RULE,
    "",
    `Erwartetes JSON-Format:\n${jsonShape}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const FLIGHTS_SHAPE = `{
  "options": [
    {
      "airline": string,
      "price": number | null,
      "priceNote": string | null,
      "currency": "EUR",
      "durationLabel": string,
      "direct": boolean,
      "baggageInfo": string | null,
      "bookingLink": string | null,
      "departureTime": string | null,
      "arrivalTime": string | null
    }
    // mindestens 3 Optionen
  ],
  "bestPickIndex": number,
  "bestPickReason": string,
  "flexibilityNote": string | null
}`;

const HOTELS_SHAPE = `{
  "options": [
    {
      "name": string,
      "source": "booking.com" | "airbnb" | "andere",
      "pricePerNight": number | null,
      "totalPrice": number | null,
      "priceNote": string | null,
      "location": string,
      "rating": number | null,
      "ratingLabel": string | null,
      "pros": [string, string, string],
      "cons": [string, string, string],
      "cancellationPolicy": string | null,
      "parkingInfo": string | null,
      "bookingLink": string | null
    }
  ],
  "bestPickIndex": number,
  "bestPickReason": string
}`;

const ACTIVITIES_SHAPE = `{
  "options": [
    {
      "title": string,
      "description": string,
      "price": number | null,
      "priceNote": string | null,
      "duration": string | null,
      "rating": string | null,
      "bookingLink": string | null,
      "label": "must-do" | "nice-to-have",
      "seasonNote": string | null
    }
    // genau 5 Optionen
  ]
}`;

const TRANSFER_SHAPE = `{
  "airportToAccommodation": [
    { "mode": string, "cost": number | null, "costNote": string | null, "duration": string | null, "notes": string | null }
  ],
  "localMobility": [
    { "mode": string, "cost": number | null, "costNote": string | null, "duration": string | null, "notes": string | null }
  ],
  "recommendation": string
}`;

const RESTAURANTS_SHAPE = `{
  "options": [
    {
      "name": string,
      "description": string,
      "cuisine": string | null,
      "priceRange": string | null,
      "rating": string | null,
      "address": string | null,
      "specialty": string | null
    }
    // 3 bis 5 Optionen
  ]
}`;

const ITINERARY_SHAPE = `{
  "days": [
    {
      "day": number,
      "dateLabel": string | null,
      "morning": { "time": string | null, "activity": string },
      "midday": { "time": string | null, "activity": string },
      "evening": { "time": string | null, "activity": string }
    }
  ]
}`;

const BUDGET_SHAPE = `{
  "items": [
    { "category": string, "amount": number | null, "amountNote": string | null, "notes": string | null }
  ],
  "total": number | null,
  "savingTips": [string]
}`;

const INSIDER_SHAPE = `{
  "currency": string | null,
  "language": string | null,
  "tipping": string | null,
  "climate": string | null,
  "safety": string | null,
  "dosAndDonts": [string],
  "appRecommendations": [string]
}`;

export function buildPromptSpec(
  category: ResearchCategory,
  briefing: TripBriefing,
  simplified = false,
): PromptSpec {
  switch (category) {
    case "flights":
      return {
        system: SYSTEM_BASE,
        prompt: buildPrompt(
          briefing,
          "Recherchiere Flugoptionen von Google Flights und vergleichbaren Quellen für diese Reise. " +
            "Finde mindestens 3 Optionen mit Preis, Airline, Flugdauer, Direktflug-Status, Gepäckhinweisen " +
            "und einem echten Buchungslink. Falls die Reisedaten flexibel sind, weise auf günstigere " +
            "Alternativtage hin (flexibilityNote). Wähle einen Best-Pick mit kurzer Begründung.",
          FLIGHTS_SHAPE,
          simplified,
        ),
      };
    case "hotels":
      return {
        system: SYSTEM_BASE,
        prompt: buildPrompt(
          briefing,
          "Recherchiere Unterkünfte auf Booking.com und Airbnb passend zu Budget, Personenzahl, Reisestil " +
            "und bevorzugter Unterkunftsart aus dem Briefing. Falls ein Mietauto gewünscht ist, erwähne " +
            "Parkmöglichkeiten. Berücksichtige nur Unterkünfte mit Mindestbewertung 8.0/10 (Booking) bzw. " +
            "4.5/5 (Airbnb). Liefere pro Option Preis/Nacht, Gesamtpreis, Lage, je 3 Pros und Cons, " +
            "Stornobedingungen und einen echten Buchungslink. Wähle einen Best-Pick mit Begründung.",
          HOTELS_SHAPE,
          simplified,
        ),
      };
    case "activities":
      return {
        system: SYSTEM_BASE,
        prompt: buildPrompt(
          briefing,
          "Recherchiere auf GetYourGuide, Viator und lokalen Tourismusseiten die Top 5 Aktivitäten passend " +
            "zum Reisestil aus dem Briefing. Markiere jede Aktivität als 'must-do' oder 'nice-to-have'. " +
            "Liefere Titel, Kurzbeschreibung, Preis, Dauer, Bewertung, einen echten Buchungslink sowie " +
            "Hinweise zu Saison/Öffnungszeiten falls relevant.",
          ACTIVITIES_SHAPE,
          simplified,
        ),
      };
    case "transfer":
      return {
        system: SYSTEM_BASE,
        prompt: buildPrompt(
          briefing,
          "Recherchiere Transfermöglichkeiten vom Flughafen zur Unterkunft (alle Optionen mit Kosten: " +
            "Taxi, Shuttle, ÖPNV, Mietwagen) sowie lokale Mobilität am Zielort (ÖPNV, Mietwagen, Taxi-Apps) " +
            "mit Kostenvergleich. Gib eine klare Gesamtempfehlung.",
          TRANSFER_SHAPE,
          simplified,
        ),
      };
    case "restaurants":
      return {
        system: SYSTEM_BASE,
        prompt: buildPrompt(
          briefing,
          "Recherchiere 3-5 authentische Restaurant-Empfehlungen am Zielort (Geheimtipps, top-bewertet, " +
            "besonderes Ambiente), passend zum Reisestil aus dem Briefing. Liefere Name, Kurzbeschreibung, " +
            "Küche, Preisklasse, Bewertung und ggf. Adresse und Spezialität.",
          RESTAURANTS_SHAPE,
          simplified,
        ),
      };
    case "itinerary":
      return {
        system: SYSTEM_BASE,
        prompt: buildPrompt(
          briefing,
          "Erstelle einen Tagesplan (Morgen/Mittag/Abend, mit ungefähren Uhrzeiten) für jeden Reisetag. " +
            "Kombiniere sinnvoll Aktivitäten und Restaurant-Empfehlungen passend zum Reisestil und der " +
            "Reisedauer aus dem Briefing. Wenn keine festen Daten vorliegen, nummeriere die Tage einfach " +
            "durch (Tag 1, Tag 2, ...).",
          ITINERARY_SHAPE,
          simplified,
        ),
      };
    case "budget":
      return {
        system: SYSTEM_BASE,
        prompt: buildPrompt(
          briefing,
          "Erstelle eine realistische Budget-Aufschlüsselung für die gesamte Reise (Flug, Unterkunft, " +
            "Aktivitäten, Transfer, Essen, Puffer) basierend auf recherchierten oder üblichen Preisen für " +
            "das Ziel. Nenne die Gesamtsumme und liste konkrete Sparoptionen auf.",
          BUDGET_SHAPE,
          simplified,
        ),
      };
    case "insiderTips":
      return {
        system: SYSTEM_BASE,
        prompt: buildPrompt(
          briefing,
          "Recherchiere Insider-Tipps für das Reiseziel: Währung, Sprache, Trinkgeld-Gepflogenheiten, " +
            "Klima zur Reisezeit, Sicherheitshinweise, kulturelle Do's & Don'ts sowie hilfreiche App-" +
            "Empfehlungen (Navigation, Übersetzung, ÖPNV, Essen).",
          INSIDER_SHAPE,
          simplified,
        ),
      };
  }
}

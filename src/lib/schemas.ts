import { z } from "zod";

// ---------------------------------------------------------------------------
// Phase 1 — Briefing (wizard answers)
// ---------------------------------------------------------------------------

export const TRAVEL_STYLES = [
  "Strand & Entspannung",
  "Städtetrip & Kultur",
  "Abenteuer & Natur",
  "Nightlife",
  "Food-Erlebnisse",
  "Familienfreundlich",
] as const;

export const SPECIAL_REQUIREMENT_CHIPS = [
  "Haustier",
  "Barrierefreiheit",
  "Vegan",
  "Mietauto",
] as const;

export const ACCOMMODATION_TYPES = [
  "Egal",
  "Hotel",
  "Ferienwohnung",
  "Boutique-Hotel",
  "Resort",
  "Hostel",
] as const;

export const tripBriefingSchema = z.object({
  destination: z.string().min(1),
  origin: z.string().min(1),
  openJaw: z.boolean().default(false),
  dateMode: z.enum(["fixed", "flexible"]),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  flexibleDays: z.number().int().min(0).max(14).default(3),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(20),
  budgetTotal: z.number().nonnegative().nullable(),
  bestValue: z.boolean().default(false),
  travelStyles: z.array(z.string()).min(1),
  accommodationType: z.string().default("Egal"),
  specialRequirementChips: z.array(z.string()).default([]),
  specialRequirementsText: z.string().default(""),
});

export type TripBriefing = z.infer<typeof tripBriefingSchema>;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

// Price is either a number in EUR, or null with a human note ("Preis auf Anfrage / prüfen")
const priceField = z.number().nonnegative().nullable();
const noteField = z.string().nullable().default(null);
const linkField = z
  .string()
  .nullable()
  .default(null)
  .describe("Echte URL aus den Suchergebnissen, sonst null");

// ---------------------------------------------------------------------------
// Flights
// ---------------------------------------------------------------------------

export const flightOptionSchema = z.object({
  airline: z.string(),
  price: priceField,
  priceNote: noteField,
  currency: z.string().default("EUR"),
  durationLabel: z.string().describe("z.B. '2h 35m' oder '11h 20m (1 Stopp)'"),
  direct: z.boolean(),
  baggageInfo: z.string().nullable().default(null),
  bookingLink: linkField,
  departureTime: z.string().nullable().default(null),
  arrivalTime: z.string().nullable().default(null),
});

export const flightsResultSchema = z.object({
  options: z.array(flightOptionSchema).min(1),
  bestPickIndex: z.number().int().min(0),
  bestPickReason: z.string(),
  flexibilityNote: noteField,
});

export type FlightOption = z.infer<typeof flightOptionSchema>;
export type FlightsResult = z.infer<typeof flightsResultSchema>;

// ---------------------------------------------------------------------------
// Hotels / Unterkünfte
// ---------------------------------------------------------------------------

export const hotelOptionSchema = z.object({
  name: z.string(),
  source: z.enum(["booking.com", "airbnb", "andere"]),
  pricePerNight: priceField,
  totalPrice: priceField,
  priceNote: noteField,
  location: z.string(),
  rating: z.number().min(0).max(10).nullable(),
  ratingLabel: z.string().nullable().default(null).describe("z.B. '9.2/10' oder '4.7/5'"),
  pros: z.array(z.string()).max(3),
  cons: z.array(z.string()).max(3),
  cancellationPolicy: z.string().nullable().default(null),
  parkingInfo: noteField,
  bookingLink: linkField,
});

export const hotelsResultSchema = z.object({
  options: z.array(hotelOptionSchema).min(1),
  bestPickIndex: z.number().int().min(0),
  bestPickReason: z.string(),
});

export type HotelOption = z.infer<typeof hotelOptionSchema>;
export type HotelsResult = z.infer<typeof hotelsResultSchema>;

// ---------------------------------------------------------------------------
// Activities / Aktivitäten
// ---------------------------------------------------------------------------

export const activityOptionSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: priceField,
  priceNote: noteField,
  duration: z.string().nullable().default(null),
  rating: z.string().nullable().default(null),
  bookingLink: linkField,
  label: z.enum(["must-do", "nice-to-have"]),
  seasonNote: noteField,
});

export const activitiesResultSchema = z.object({
  options: z.array(activityOptionSchema).min(1),
});

export type ActivityOption = z.infer<typeof activityOptionSchema>;
export type ActivitiesResult = z.infer<typeof activitiesResultSchema>;

// ---------------------------------------------------------------------------
// Transfer & Mobilität
// ---------------------------------------------------------------------------

export const transferOptionSchema = z.object({
  mode: z.string(),
  cost: priceField,
  costNote: noteField,
  duration: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
});

export const transferResultSchema = z.object({
  airportToAccommodation: z.array(transferOptionSchema).min(1),
  localMobility: z.array(transferOptionSchema).min(1),
  recommendation: z.string(),
});

export type TransferOption = z.infer<typeof transferOptionSchema>;
export type TransferResult = z.infer<typeof transferResultSchema>;

// ---------------------------------------------------------------------------
// Restaurants
// ---------------------------------------------------------------------------

export const restaurantOptionSchema = z.object({
  name: z.string(),
  description: z.string(),
  cuisine: z.string().nullable().default(null),
  priceRange: z.string().nullable().default(null),
  rating: z.string().nullable().default(null),
  address: z.string().nullable().default(null),
  specialty: z.string().nullable().default(null),
});

export const restaurantsResultSchema = z.object({
  options: z.array(restaurantOptionSchema).min(1),
});

export type RestaurantOption = z.infer<typeof restaurantOptionSchema>;
export type RestaurantsResult = z.infer<typeof restaurantsResultSchema>;

// ---------------------------------------------------------------------------
// Itinerary / Tagesplan
// ---------------------------------------------------------------------------

export const daySlotSchema = z.object({
  time: z.string().nullable().default(null),
  activity: z.string(),
});

export const itineraryDaySchema = z.object({
  day: z.number().int().min(1),
  dateLabel: z.string().nullable().default(null),
  morning: daySlotSchema,
  midday: daySlotSchema,
  evening: daySlotSchema,
});

export const itineraryResultSchema = z.object({
  days: z.array(itineraryDaySchema).min(1),
});

export type ItineraryDay = z.infer<typeof itineraryDaySchema>;
export type ItineraryResult = z.infer<typeof itineraryResultSchema>;

// ---------------------------------------------------------------------------
// Budget
// ---------------------------------------------------------------------------

export const budgetItemSchema = z.object({
  category: z.string(),
  amount: priceField,
  amountNote: noteField,
  notes: z.string().nullable().default(null),
});

export const budgetResultSchema = z.object({
  items: z.array(budgetItemSchema).min(1),
  total: priceField,
  savingTips: z.array(z.string()).default([]),
});

export type BudgetItem = z.infer<typeof budgetItemSchema>;
export type BudgetResult = z.infer<typeof budgetResultSchema>;

// ---------------------------------------------------------------------------
// Insider tips
// ---------------------------------------------------------------------------

export const insiderTipsResultSchema = z.object({
  currency: z.string().nullable().default(null),
  language: z.string().nullable().default(null),
  tipping: z.string().nullable().default(null),
  climate: z.string().nullable().default(null),
  safety: z.string().nullable().default(null),
  dosAndDonts: z.array(z.string()).default([]),
  appRecommendations: z.array(z.string()).default([]),
});

export type InsiderTipsResult = z.infer<typeof insiderTipsResultSchema>;

// ---------------------------------------------------------------------------
// Category registry
// ---------------------------------------------------------------------------

export const RESEARCH_CATEGORIES = [
  "flights",
  "hotels",
  "activities",
  "transfer",
  "restaurants",
  "itinerary",
  "budget",
  "insiderTips",
] as const;

export type ResearchCategory = (typeof RESEARCH_CATEGORIES)[number];

export const categorySchemas: Record<ResearchCategory, z.ZodTypeAny> = {
  flights: flightsResultSchema,
  hotels: hotelsResultSchema,
  activities: activitiesResultSchema,
  transfer: transferResultSchema,
  restaurants: restaurantsResultSchema,
  itinerary: itineraryResultSchema,
  budget: budgetResultSchema,
  insiderTips: insiderTipsResultSchema,
};

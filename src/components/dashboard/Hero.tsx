import { formatDateRange, formatEUR } from "@/lib/format";
import type { TripData } from "@/lib/tripData";

function HeroPill({
  children,
  emphasis = false,
}: {
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium backdrop-blur-sm ${
        emphasis
          ? "bg-white text-accent-dark shadow-sm"
          : "bg-white/15 text-white ring-1 ring-inset ring-white/25"
      }`}
    >
      {children}
    </span>
  );
}

// Deterministic gradient pick per destination so the same trip always gets the same look.
const GRADIENTS = [
  "from-[#8a4a2f] via-[#b1502f] to-[#c98a3e]",
  "from-[#2f5348] via-[#3d5952] to-[#7a9186]",
  "from-[#4a3a55] via-[#6b4f66] to-[#b1502f]",
  "from-[#1f4a52] via-[#3d5952] to-[#b8903f]",
];

function pickGradient(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

export function Hero({ trip }: { trip: TripData }) {
  const { briefing } = trip;
  const gradient = pickGradient(briefing.destination);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} text-white`}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 0, transparent 45%), radial-gradient(circle at 80% 60%, white 0, transparent 40%)",
        }}
      />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-5 px-6 py-14 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
          Dein Reise-Dashboard
        </p>
        <h1 className="font-display text-4xl leading-tight sm:text-6xl">
          {briefing.destination}
        </h1>
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <HeroPill>{formatDateRange(trip.briefing.startDate, trip.briefing.endDate)}</HeroPill>
          <HeroPill>
            {briefing.adults} Erw.{briefing.children > 0 ? ` · ${briefing.children} Kinder` : ""}
          </HeroPill>
          <HeroPill emphasis>
            {briefing.bestValue ? "Bestes Preis-Leistungs-Verhältnis" : formatEUR(briefing.budgetTotal)}
          </HeroPill>
          {briefing.travelStyles.slice(0, 2).map((style) => (
            <HeroPill key={style}>{style}</HeroPill>
          ))}
        </div>
      </div>
    </div>
  );
}

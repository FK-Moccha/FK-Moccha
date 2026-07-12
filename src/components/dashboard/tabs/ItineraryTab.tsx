import { Card } from "@/components/shared/Card";
import { CategoryErrorNote } from "../CategoryErrorNote";
import { TabHeader } from "../TabHeader";
import type { TabProps } from "../types";
import type { ItineraryDay } from "@/lib/schemas";

function DaySlotRow({
  label,
  slot,
}: {
  label: string;
  slot: ItineraryDay["morning"];
}) {
  return (
    <div className="flex gap-4">
      <div className="w-20 shrink-0 pt-0.5 text-right">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
        {slot.time && <p className="text-xs text-ink-faint">{slot.time}</p>}
      </div>
      <div className="relative flex-1 border-l-2 border-line pb-6 pl-5">
        <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-accent" />
        <p className="text-ink">{slot.activity}</p>
      </div>
    </div>
  );
}

export function ItineraryTab({ trip, editable, onTripChange }: TabProps) {
  const itinerary = trip.itinerary;
  const header = (
    <TabHeader
      title="Tagesplan"
      editable={editable}
      tripId={trip.id}
      category="itinerary"
      onTripChange={onTripChange}
    />
  );

  if (!itinerary) {
    return (
      <div>
        {header}
        {trip.researchErrors.itinerary ? (
          <CategoryErrorNote message={trip.researchErrors.itinerary} />
        ) : (
          <p className="text-ink-soft">Noch kein Tagesplan verfügbar.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="flex flex-col gap-6">
      {itinerary.days.map((day) => (
        <Card key={day.day} className="p-6">
          <h3 className="mb-5 font-display text-xl text-ink">
            Tag {day.day}
            {day.dateLabel && <span className="ml-2 text-base font-normal text-ink-faint">{day.dateLabel}</span>}
          </h3>
          <div className="flex flex-col">
            <DaySlotRow label="Morgen" slot={day.morning} />
            <DaySlotRow label="Mittag" slot={day.midday} />
            <DaySlotRow label="Abend" slot={day.evening} />
          </div>
        </Card>
      ))}
      </div>
    </div>
  );
}

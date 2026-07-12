import { RegenerateButton } from "./RegenerateButton";
import type { ResearchCategory } from "@/lib/schemas";
import type { TripData } from "@/lib/tripData";

export function TabHeader({
  title,
  subtitle,
  editable,
  tripId,
  category,
  onTripChange,
}: {
  title: string;
  subtitle?: string;
  editable: boolean;
  tripId: string;
  category: ResearchCategory;
  onTripChange: (trip: TripData) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {editable && (
        <RegenerateButton tripId={tripId} category={category} onDone={onTripChange} />
      )}
    </div>
  );
}

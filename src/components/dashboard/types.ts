import type { TripData } from "@/lib/tripData";

export interface TabProps {
  trip: TripData;
  editable: boolean;
  onTripChange: (trip: TripData) => void;
}

import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { CategoryErrorNote } from "../CategoryErrorNote";
import { TabHeader } from "../TabHeader";
import { formatEUR } from "@/lib/format";
import type { TabProps } from "../types";

export function ActivitiesTab({ trip, editable, onTripChange }: TabProps) {
  const activities = trip.activities;
  const header = (
    <TabHeader
      title="Aktivitäten"
      editable={editable}
      tripId={trip.id}
      category="activities"
      onTripChange={onTripChange}
    />
  );

  if (!activities) {
    return (
      <div>
        {header}
        {trip.researchErrors.activities ? (
          <CategoryErrorNote message={trip.researchErrors.activities} />
        ) : (
          <p className="text-ink-soft">Noch keine Aktivitäten verfügbar.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {activities.options.map((activity, i) => (
        <Card key={`${activity.title}-${i}`} className="flex flex-col gap-3 p-6">
          <Badge tone={activity.label === "must-do" ? "accent" : "neutral"}>
            {activity.label === "must-do" ? "Must-Do" : "Nice-to-Have"}
          </Badge>
          <h3 className="font-display text-lg leading-snug text-ink">{activity.title}</h3>
          <p className="text-sm text-ink-soft">{activity.description}</p>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-sm text-ink-faint">
            <span className="font-display text-lg text-ink">
              {activity.price !== null ? formatEUR(activity.price) : activity.priceNote ?? "Preis auf Anfrage"}
            </span>
            {activity.duration && <span>· {activity.duration}</span>}
            {activity.rating && <span>· ★ {activity.rating}</span>}
          </div>
          {activity.seasonNote && (
            <p className="text-xs text-ink-faint">📅 {activity.seasonNote}</p>
          )}
          {activity.bookingLink ? (
            <a
              href={activity.bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              Buchen ↗
            </a>
          ) : (
            <span className="text-xs text-ink-faint">kein Buchungslink</span>
          )}
        </Card>
      ))}
      </div>
    </div>
  );
}

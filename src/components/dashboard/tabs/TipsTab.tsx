import { Card } from "@/components/shared/Card";
import { CategoryErrorNote } from "../CategoryErrorNote";
import { TabHeader } from "../TabHeader";
import type { TabProps } from "../types";

function InfoRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

export function TipsTab({ trip, editable, onTripChange }: TabProps) {
  const tips = trip.insiderTips;
  const header = (
    <TabHeader
      title="Insider-Tipps"
      editable={editable}
      tripId={trip.id}
      category="insiderTips"
      onTripChange={onTripChange}
    />
  );

  if (!tips) {
    return (
      <div>
        {header}
        {trip.researchErrors.insiderTips ? (
          <CategoryErrorNote message={trip.researchErrors.insiderTips} />
        ) : (
          <p className="text-ink-soft">Noch keine Insider-Tipps verfügbar.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-2 font-display text-xl text-ink">Auf einen Blick</h3>
        <div className="flex flex-col">
          <InfoRow label="Währung" value={tips.currency} />
          <InfoRow label="Sprache" value={tips.language} />
          <InfoRow label="Trinkgeld" value={tips.tipping} />
          <InfoRow label="Klima" value={tips.climate} />
          <InfoRow label="Sicherheit" value={tips.safety} />
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        {tips.dosAndDonts.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-3 font-display text-xl text-ink">Do&apos;s &amp; Don&apos;ts</h3>
            <ul className="flex flex-col gap-2">
              {tips.dosAndDonts.map((tip) => (
                <li key={tip} className="flex gap-2 text-ink-soft">
                  <span className="text-accent">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {tips.appRecommendations.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-3 font-display text-xl text-ink">App-Empfehlungen</h3>
            <ul className="flex flex-wrap gap-2">
              {tips.appRecommendations.map((app) => (
                <li
                  key={app}
                  className="rounded-full bg-teal-soft px-3.5 py-1.5 text-sm font-medium text-teal"
                >
                  {app}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
      </div>
    </div>
  );
}

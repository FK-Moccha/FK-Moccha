export function Stepper({
  label,
  value,
  min = 0,
  max = 20,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-card px-5 py-4">
      <span className="font-medium text-ink">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-lg text-ink-soft transition hover:border-accent hover:text-accent disabled:opacity-30"
        >
          −
        </button>
        <span className="w-6 text-center text-lg font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-lg text-ink-soft transition hover:border-accent hover:text-accent disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}

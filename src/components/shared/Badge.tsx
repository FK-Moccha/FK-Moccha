export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "teal" | "gold";
}) {
  const toneClasses = {
    neutral: "bg-stone-soft text-ink-soft",
    accent: "bg-accent text-white",
    teal: "bg-teal text-white",
    gold: "bg-gold/20 text-[#7a5c22]",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${toneClasses}`}
    >
      {children}
    </span>
  );
}

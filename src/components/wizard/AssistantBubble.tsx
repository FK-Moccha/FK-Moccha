export function AssistantBubble({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 animate-fade-up">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal text-sm font-semibold text-white font-display">
        V
      </div>
      <div className="max-w-xl rounded-2xl rounded-tl-sm bg-card border border-line px-5 py-4 text-lg font-display text-ink shadow-sm">
        {children}
      </div>
    </div>
  );
}

export function CategoryErrorNote({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-line bg-stone-soft px-4 py-3 text-sm text-ink-soft">
      <span className="font-medium text-ink">Hinweis: </span>
      Diese Kategorie konnte nicht vollständig recherchiert werden ({message}). Versuche es über
      &bdquo;Neu recherchieren&ldquo; erneut.
    </div>
  );
}

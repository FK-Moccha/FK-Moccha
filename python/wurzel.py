"""
Berechnung der n-ten Wurzel ohne math.sqrt, pow() oder ** 0.5.

Zwei Verfahren zum Vergleich:
  1. Newton-Verfahren (für n = 2 auch Heron-Verfahren genannt)
  2. Bisektion (Intervallhalbierung)

Start:  python3 wurzel.py
"""

TOLERANZ = 1e-12
MAX_SCHRITTE = 1000


def potenz(basis, exponent):
    """basis hoch exponent (ganzzahlig, >= 0) – nur mit Multiplikation."""
    ergebnis = 1.0
    for _ in range(exponent):
        ergebnis *= basis
    return ergebnis


def pruefe_eingabe(x, n):
    """Gibt (Betrag von x, Vorzeichen des Ergebnisses) zurück."""
    if n < 1:
        raise ValueError("Der Wurzelgrad n muss mindestens 1 sein.")
    if x < 0:
        if n % 2 == 0:
            raise ValueError("Gerade Wurzeln aus negativen Zahlen sind nicht reell.")
        # Ungerade Wurzel einer negativen Zahl: -(n-te Wurzel von |x|)
        return -x, -1
    return x, 1


def wurzel_newton(x, n=2):
    """
    Newton-Verfahren für y^n = x:
        y_neu = ((n - 1) * y + x / y^(n-1)) / n
    Gibt (Ergebnis, Anzahl Schritte) zurück.
    """
    x, vorzeichen = pruefe_eingabe(x, n)
    if x == 0:
        return 0.0, 0

    y = x if x > 1 else 1.0  # Startwert liegt sicher oberhalb der Wurzel
    for schritt in range(1, MAX_SCHRITTE + 1):
        y_neu = ((n - 1) * y + x / potenz(y, n - 1)) / n
        if abs(y_neu - y) <= TOLERANZ * y_neu:
            return vorzeichen * y_neu, schritt
        y = y_neu
    return vorzeichen * y, MAX_SCHRITTE


def wurzel_bisektion(x, n=2):
    """
    Bisektion: Die Wurzel liegt zwischen 0 und max(1, x).
    Das Intervall wird so lange halbiert, bis es klein genug ist.
    Gibt (Ergebnis, Anzahl Schritte) zurück.
    """
    x, vorzeichen = pruefe_eingabe(x, n)
    if x == 0:
        return 0.0, 0

    unten, oben = 0.0, max(1.0, x)
    mitte = (unten + oben) / 2
    for schritt in range(1, MAX_SCHRITTE + 1):
        mitte = (unten + oben) / 2
        if potenz(mitte, n) > x:
            oben = mitte
        else:
            unten = mitte
        if oben - unten <= TOLERANZ * mitte:
            return vorzeichen * mitte, schritt
    return vorzeichen * mitte, MAX_SCHRITTE


def main():
    print("=== n-te Wurzel berechnen (ohne sqrt) ===")
    print("Leere Eingabe beendet das Programm.\n")

    while True:
        eingabe = input("Zahl x: ").strip().replace(",", ".")
        if not eingabe:
            break
        grad = input("Wurzelgrad n [2]: ").strip() or "2"

        try:
            x = float(eingabe)
            n = int(grad)
            newton, schritte_newton = wurzel_newton(x, n)
            bisektion, schritte_bisektion = wurzel_bisektion(x, n)
        except ValueError as fehler:
            print(f"Fehler: {fehler}\n")
            continue

        print(f"\n{n}-te Wurzel von {x}:")
        print(f"  Newton:    {newton:.12f}  ({schritte_newton} Schritte)")
        print(f"  Bisektion: {bisektion:.12f}  ({schritte_bisektion} Schritte)")
        print(f"  Probe (Newton^{n}): {potenz(newton, n):.12f}\n")


if __name__ == "__main__":
    main()

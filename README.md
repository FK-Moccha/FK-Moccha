# Voyage — KI-gestützter Reiseplaner

Ein persönlicher Reiseplaner: Du beantwortest sechs Fragen in einem Chat-artigen Wizard, Claude
recherchiert daraufhin Flüge, Unterkünfte, Aktivitäten, Transfer und Restaurants mit echten,
aktuellen Webdaten, und das Ergebnis landet in einem teilbaren Dashboard.

Gebaut mit Next.js (App Router, TypeScript), Tailwind CSS, Prisma + SQLite und der Anthropic API
(Claude mit dem Web-Search-Tool).

## Funktionsweise

1. **Briefing-Wizard** (`/plan`) — sechs Fragen nacheinander (Ziel & Abflug, Reisedaten, Reisegruppe,
   Budget, Reisestil, Besonderheiten).
2. **Recherche-Pipeline** (serverseitig) — für jede Kategorie ein eigener, fokussierter Aufruf an
   Claude mit dem Web-Search-Tool. Jede Antwort wird als striktes JSON gefordert und mit Zod
   validiert (`src/lib/schemas.ts`). Schlägt eine Kategorie fehl, wird einmal mit vereinfachtem
   Prompt erneut versucht; bleibt es dabei, zeigt das Dashboard einen Hinweis statt zu crashen.
3. **Dashboard** (`/trip/[id]`) — Hero-Banner + 7 Tabs (Übersicht, Flüge, Unterkünfte, Aktivitäten,
   Tagesplan, Budget, Insider-Tipps). Ohne `?edit=1` ist die Seite die read-only Share-Ansicht;
   mit `?edit=1` (Link von der Startseite) gibt es zusätzlich "Neu recherchieren"-Buttons pro
   Kategorie.

## Setup

### Voraussetzungen

- Node.js 20+
- Ein [Anthropic API Key](https://console.anthropic.com/settings/keys)

### Installation

```bash
npm install
cp .env.example .env
```

Trage in `.env` deinen `ANTHROPIC_API_KEY` ein. `DATABASE_URL` ist bereits auf eine lokale
SQLite-Datei (`./dev.db`) vorkonfiguriert.

```bash
npm run db:migrate   # legt die SQLite-Datenbank an (prisma migrate dev)
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

### Umgebungsvariablen

| Variable               | Pflicht | Beschreibung                                                                 |
| ----------------------- | ------- | ----------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`    | ja      | Wird ausschließlich serverseitig verwendet (`src/lib/anthropic.ts`), nie im Client-Bundle. |
| `DATABASE_URL`         | ja      | SQLite-Verbindung, z.B. `file:./dev.db`.                                       |
| `CREATE_TRIP_PASSWORD` | nein    | Wenn gesetzt, muss dieses Passwort beim Anlegen einer neuen Reise angegeben werden. Bestehende/geteilte Reisen bleiben ohne Login einsehbar. |

## Recherche-Pipeline testen

Die Pipeline lässt sich direkt über die API anstoßen (z.B. mit dem Lissabon-Beispiel aus der
Aufgabenstellung):

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Lissabon, Portugal",
    "origin": "München",
    "openJaw": false,
    "dateMode": "fixed",
    "startDate": "2026-09-10",
    "endDate": "2026-09-15",
    "flexibleDays": 3,
    "adults": 2,
    "children": 0,
    "budgetTotal": 1500,
    "bestValue": false,
    "travelStyles": ["Städtetrip & Kultur", "Food-Erlebnisse"],
    "accommodationType": "Egal",
    "specialRequirementChips": [],
    "specialRequirementsText": ""
  }'
```

Die Antwort enthält die Trip-`id`; unter `http://localhost:3000/trip/<id>?edit=1` siehst du den
Recherche-Fortschritt live (Polling alle 2,5s) und danach das fertige Dashboard. Ohne gesetzten
`ANTHROPIC_API_KEY` schlägt jede Kategorie kontrolliert fehl und das Dashboard zeigt das
Fehlerbehandlungs-Verhalten (Status `ERROR`, Hinweis-Boxen, "Neu recherchieren"-Buttons) — so lässt
sich der Fehlerpfad auch ganz ohne API-Key nachvollziehen.

## Projektstruktur

```
src/
  app/
    page.tsx                 Startseite: Liste aller Reisen
    plan/page.tsx             Briefing-Wizard
    trip/[id]/page.tsx        Dashboard (Share- & Editier-Ansicht)
    api/trips/                REST-Endpunkte (create, list, get, regenerate, research)
  components/
    wizard/                   6-Schritte-Wizard-UI
    dashboard/                Hero, Tabs, Loading-Screen, Share-/Regenerate-Buttons
  lib/
    schemas.ts                Zod-Schemas für Briefing + alle Recherche-Kategorien
    anthropic.ts               Claude-Client-Wrapper (Web-Search-Tool, JSON-Parsing, Retry)
    research/
      prompts.ts              Prompt-Vorlagen pro Kategorie
      pipeline.ts              Orchestrierung: recherchieren, validieren, persistieren
    prisma.ts                  Prisma-Client (better-sqlite3-Adapter)
prisma/
  schema.prisma                Datenmodell (ein `Trip`-Model, Recherche-Ergebnisse als JSON)
```

## Deployment

**Wichtig: SQLite + Serverless passt nicht zusammen.** Auf Vercel (und den meisten anderen
Serverless-Plattformen) ist das Dateisystem read-only bzw. flüchtig — jede Instanz bekäme ihre
eigene, leere SQLite-Datei, und Schreibzugriffe würden fehlschlagen oder beim nächsten Kaltstart
verloren gehen. Außerdem läuft die Recherche-Pipeline hier bewusst als "Fire-and-forget"-Task auf
dem Node-Prozess weiter, nachdem die HTTP-Antwort schon zurück ist — das setzt einen langlebigen
Prozess voraus, den Serverless-Functions nicht bieten (sie werden nach der Response beendet).

**Empfohlen: ein kleiner, dauerhaft laufender Node-Server** (VPS, Fly.io, Railway, Render, ein
eigener Container o.ä.):

1. `npm run build`
2. `npm run db:deploy` (führt `prisma migrate deploy` aus, legt/aktualisiert die SQLite-Datei)
3. `npm run start` — persistent laufen lassen (z.B. via `pm2`, `systemd` oder im Docker-Container)
4. `ANTHROPIC_API_KEY`, `DATABASE_URL` (z.B. auf ein persistentes Volume zeigend) und optional
   `CREATE_TRIP_PASSWORD` als Umgebungsvariablen setzen
5. Die SQLite-Datei liegt auf einem persistenten Volume/Mount, damit sie Neustarts/Deploys übersteht

**Falls es unbedingt Vercel/Serverless sein soll:** SQLite gegen eine echte Netzwerk-Datenbank
tauschen — [Turso](https://turso.tech) (libSQL, SQLite-kompatibel, minimaler Migrationsaufwand:
Prisma-Adapter `@prisma/adapter-libsql` statt `@prisma/adapter-better-sqlite3`) oder Postgres
(`@prisma/adapter-pg` + `provider = "postgresql"` in `prisma/schema.prisma`) sind die naheliegendsten
Optionen. Zusätzlich müsste die Recherche-Pipeline von "Fire-and-forget im selben Prozess" auf eine
Queue/einen Cron-/Background-Job umgestellt werden (z.B. Vercel Queues, Inngest, QStash), da
Serverless-Functions nach der Response keine Hintergrundarbeit garantieren.

## Bekannte Grenzen

- Keine Nutzerkonten — jede Reise ist über ihre (schwer erratbare) ID erreichbar; der optionale
  `CREATE_TRIP_PASSWORD` schützt nur das *Erstellen* neuer Reisen, nicht das Lesen bestehender.
- Preise/Verfügbarkeiten stammen aus Web-Suchergebnissen zum Recherchezeitpunkt und können sich
  seitdem geändert haben — vor der Buchung immer auf der Zielseite gegenprüfen.
- Die Recherche-Pipeline läuft "fire-and-forget" auf dem Node-Prozess; bei einem Server-Neustart
  während einer laufenden Recherche bleibt die Reise im Status `RESEARCHING` hängen (über
  "Neu recherchieren" pro Kategorie bzw. `POST /api/trips/[id]/research` erneut anstoßbar).

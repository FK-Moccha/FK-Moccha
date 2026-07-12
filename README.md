# Voyage — dein KI-gestützter Reiseplaner

Du beantwortest sechs Fragen in einem freundlichen, chat-artigen Wizard. Im Hintergrund
recherchiert eine KI dann Flüge, Unterkünfte, Aktivitäten, Transfer, Restaurants, einen Tagesplan,
ein Budget und Insider-Tipps mit echten, aktuellen Webdaten. Das Ergebnis landet in einem
hübschen, teilbaren Dashboard, das du per Link an Familie und Freunde schicken kannst.

Diese Anleitung setzt **kein** Vorwissen voraus — jeder Schritt ist zum Kopieren gedacht. Sie
richtet sich an dich als Betreiber:in der App, nicht an alle, die später einen Reise-Link
bekommen (die brauchen nur den Link, sonst nichts).

Was du am Ende hast: eine App, die auf deinem eigenen Rechner läuft (oder auf einem Server, wenn
du magst) und Reisen für dich plant — für ein paar Cent pro Reise.

---

## Schritt (a): Node.js installieren

Die App braucht **Node.js**, die Software-Umgebung, mit der sie läuft.

1. Öffne [nodejs.org](https://nodejs.org)
2. Lade die **LTS-Version** herunter (aktuell empfohlen: **Version 20 oder neuer** — auf der
   Nodejs-Startseite ist der große, grüne Button meist schon die richtige LTS-Version)
3. Installiere sie wie jedes andere Programm (Installer öffnen, „Weiter“ klicken, fertig)

**Prüfen, ob es geklappt hat:** Öffne ein Terminal (macOS: „Terminal“-App über Spotlight suchen;
Windows: „Eingabeaufforderung“ oder „PowerShell“ über die Windows-Suche) und tippe:

```bash
node -v
```

Es sollte etwas wie `v20.x.x` oder `v22.x.x` erscheinen. Steht da eine Fehlermeldung, starte
zuerst den Terminal/Computer neu — meistens reicht das.

---

## Schritt (b): Projekt herunterladen

Am einfachsten lädst du das Projekt als ZIP-Datei herunter — dafür brauchst du **kein** Git:

1. Gehe zu `https://github.com/fk-moccha/fk-moccha`
2. Klicke auf den grünen Button **„Code“** → **„Download ZIP“**
3. Entpacke die ZIP-Datei an einen Ort deiner Wahl (z.B. auf den Schreibtisch)

Wenn du Git bereits installiert hast und dich damit auskennst, geht es auch per Klonen:

```bash
git clone https://github.com/fk-moccha/fk-moccha.git
cd fk-moccha
```

Öffne danach ein Terminal **in genau diesem Ordner**. Tipp: Auf den meisten Systemen kannst du im
Ordner-Fenster mit der rechten Maustaste klicken und findest dort „Terminal hier öffnen“ o.ä.
Alternativ im Terminal mit `cd` dorthin wechseln, z.B.:

```bash
cd ~/Desktop/fk-moccha
```

---

## Schritt (c): Abhängigkeiten installieren

Im Projektordner (im Terminal):

```bash
npm install
```

Das lädt alle Bausteine herunter, die die App braucht. Das kann beim ersten Mal ein bis zwei
Minuten dauern — das ist normal. Am Ende sollte keine rote Fehlermeldung stehenbleiben (Warnungen
in Gelb sind unproblematisch).

---

## Schritt (d): `.env`-Datei anlegen — API-Key eintragen

Die App braucht einen **Perplexity-API-Key**, damit sie im Internet recherchieren kann. Das ist
der einzige laufende Kostenpunkt (siehe [Kosten](#kosten) weiter unten) — Perplexity selbst ist
kostenlos nutzbar, du zahlst nur für tatsächlich verbrauchte Anfragen, meist im Cent-Bereich.

**1. Vorlage kopieren.** Im Projektordner:

```bash
cp .env.example .env
```

(Auf Windows in der `cmd`, falls `cp` nicht funktioniert: `copy .env.example .env`)

**2. API-Key erstellen.**

1. Gehe zu [perplexity.ai](https://www.perplexity.ai) und lege dir einen Account an (oder logge
   dich ein)
2. Öffne [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)
3. Wechsle dort zum Reiter **„API Keys“**
4. Klicke auf **„Create API Key“** (oder ähnlich benannt) und kopiere den angezeigten Key sofort —
   er wird meist nur einmal vollständig angezeigt
5. **Guthaben prüfen:** Auf derselben Seite siehst du dein aktuelles API-Guthaben. Perplexity
   verlangt in der Regel ein kleines Startguthaben (wenige Euro/Dollar), bevor der Key
   funktioniert — falls dort „$0“ oder „kein Guthaben“ steht, lade im selben Bereich etwas Guthaben
   auf (schon 5 € reichen für sehr viele Reiseplanungen, siehe [Kosten](#kosten))

**3. Key in die `.env`-Datei eintragen.** Öffne die Datei `.env` (die in Schritt 1 erstellt wurde)
mit einem einfachen Texteditor (z.B. Editor/Notepad unter Windows, TextEdit unter macOS — **kein**
Word!) und trage deinen Key hinter `PERPLEXITY_API_KEY=` ein, ohne Leerzeichen und ohne
Anführungszeichen:

```env
PERPLEXITY_API_KEY=pplx-dein-eigener-key-hier
```

Speichern nicht vergessen.

> ⚠️ **Wichtig:** Die `.env`-Datei ist nur für dich — sie wird von Git ignoriert und landet nie in
> einem geteilten Code-Repository. Gib deinen Key trotzdem an niemanden weiter und lade ihn
> nirgendwo hoch.

---

## Schritt (e): Datenbank einrichten

Die App speichert alle geplanten Reisen in einer kleinen, lokalen Datenbank-Datei. Die legst du
mit einem einzigen Befehl an:

```bash
npm run db:migrate
```

Das fragt dich eventuell nach einem Namen für die erste „Migration“ — du kannst einfach Enter
drücken bzw. den vorgeschlagenen Namen übernehmen. Am Ende ist im Projektordner eine neue Datei
`dev.db` entstanden — das ist deine Datenbank.

---

## Schritt (f): App starten

```bash
npm run dev
```

Im Terminal erscheint etwas wie `Local: http://localhost:3000`. Öffne diese Adresse
([http://localhost:3000](http://localhost:3000)) in deinem Browser — fertig, die App läuft!

Zum Beenden: im Terminal `Strg+C` (Windows/Linux) bzw. `Cmd+C` (macOS) drücken. Beim nächsten Mal
reicht wieder `npm run dev` im Projektordner, um die App zu starten — Schritte (a) bis (e) sind
nur einmalig nötig.

---

## Schritt (g): Kostenlos mit Familie & Freunden teilen (Cloudflare Tunnel)

`localhost:3000` ist nur auf deinem eigenen Rechner erreichbar. Damit andere deine geplanten
Reisen im Browser ansehen können — ohne dass du irgendwo einen Server mieten musst — reicht ein
kostenloser **Cloudflare Tunnel**. Er erzeugt eine öffentliche Internetadresse, die auf deinen
laufenden `npm run dev`-Prozess zeigt, solange dein Rechner läuft und die App gestartet ist.

**Installation von `cloudflared`:**

- **macOS** (mit [Homebrew](https://brew.sh)):
  ```bash
  brew install cloudflared
  ```
- **Windows:** Installer herunterladen von
  [github.com/cloudflare/cloudflared/releases/latest](https://github.com/cloudflare/cloudflared/releases/latest)
  (Datei mit `-windows-amd64.msi` im Namen) und ausführen. Alternativ mit
  [winget](https://learn.microsoft.com/windows/package-manager/winget/):
  ```bash
  winget install --id Cloudflare.cloudflared
  ```
- **Linux:** Paket von derselben Release-Seite passend zu deiner Distribution herunterladen, oder
  siehe die [offizielle Installationsanleitung](https://github.com/cloudflare/cloudflared).

**Tunnel starten** (bei laufender App, also während `npm run dev` in einem anderen Terminal-Fenster
läuft):

```bash
cloudflared tunnel --url http://localhost:3000
```

Im Terminal erscheint eine Zeile mit einer Adresse wie `https://irgendwas-zufällig.trycloudflare.com`
— genau diesen Link kannst du an Familie und Freunde schicken. Er funktioniert, solange sowohl
`npm run dev` **als auch** der `cloudflared`-Befehl in ihren jeweiligen Terminal-Fenstern laufen.
Schließt du eines der beiden Fenster, ist der Link nicht mehr erreichbar (und generiert beim
nächsten Start eine neue Adresse). Kein Cloudflare-Account nötig — das ist der kostenlose „Quick
Tunnel“-Modus.

> 💡 Falls beim Anlegen einer Reise ein Passwort verlangt werden soll (z.B. weil du nicht willst,
> dass Fremde über den Link neue, kostenpflichtige Recherchen anstoßen), trage in der `.env` bei
> `CREATE_TRIP_PASSWORD` ein Passwort deiner Wahl ein und starte die App neu. Bereits geplante
> Reisen bleiben für alle mit Link weiterhin einsehbar — nur das *Anlegen neuer* Reisen wird dann
> nach dem Passwort fragen.

---

## Kosten

Perplexity berechnet pro Anfrage nach Modell und „Such-Kontext“. Diese App ist bewusst auf das
günstigste Modell (`sonar`) und den günstigsten Such-Kontext (`low`) eingestellt — das ist bereits
in `.env.example` bzw. deiner `.env` so voreingestellt (`PPLX_MODEL=sonar`,
`PPLX_SEARCH_CONTEXT_SIZE=low`).

Eine komplette Reiseplanung stößt **8 Recherche-Anfragen** an (eine pro Kategorie: Flüge,
Unterkünfte, Aktivitäten, Transfer, Restaurants, Tagesplan, Budget, Insider-Tipps). Nach grober
Schätzung auf Basis der aktuell öffentlichen Sonar-Preise liegt eine komplette Reiseplanung damit
typischerweise im **niedrigen Cent-Bereich** (deutlich unter 1 €). Ein Guthaben von wenigen Euro
reicht also für sehr viele geplante Reisen.

Das ist eine Schätzung, keine Garantie — aktuelle Preise findest du direkt bei Perplexity unter
[perplexity.ai/hub/blog](https://www.perplexity.ai/hub) bzw. auf der API-Preisseite, verlinkt von
[perplexity.ai/settings/api](https://www.perplexity.ai/settings/api).

**Deinen tatsächlichen Verbrauch siehst du** ebenfalls unter
[perplexity.ai/settings/api](https://www.perplexity.ai/settings/api) — dort gibt es einen Bereich
für Nutzung/Guthaben (oft „Usage“ oder „Billing“ genannt), der zeigt, wie viel Guthaben bereits
verbraucht wurde und wie viel noch übrig ist.

---

## Fehlermeldungen verstehen

Die App zeigt verständliche Hinweise direkt im Dashboard an, statt kryptisch abzustürzen:

| Meldung im Dashboard                                          | Bedeutung & Lösung                                                        |
| --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| „API-Key fehlt — trage deinen Perplexity-API-Key … ein“        | Schritt (d) wurde noch nicht (vollständig) durchgeführt — `.env` prüfen.  |
| „Perplexity hat den API-Key abgelehnt (ungültiger …)“           | Der Key in der `.env` ist falsch/abgelaufen — neuen Key erstellen (Schritt d, Punkt 2). |
| „Kein API-Guthaben — bitte unter perplexity.ai/settings/api aufladen.“ | Dein Perplexity-Guthaben ist aufgebraucht — dort aufladen (siehe [Kosten](#kosten)). |
| „… Rate-Limit wurde erreicht (429) …“                           | Zu viele Anfragen in kurzer Zeit — einfach kurz warten und über „Neu recherchieren“ erneut versuchen. |

Eine fehlgeschlagene Kategorie blockiert nicht das ganze Dashboard: Die anderen Kategorien werden
trotzdem angezeigt, und über den „Neu recherchieren“-Button (nur in der Editier-Ansicht, also mit
`?edit=1` am Ende der Adresse) lässt sich jede Kategorie einzeln erneut versuchen, sobald das
zugrundeliegende Problem behoben ist.

---

## Funktionsweise (für Interessierte)

1. **Briefing-Wizard** (`/plan`) — sechs Fragen nacheinander (Ziel & Abflug, Reisedaten,
   Reisegruppe, Budget, Reisestil, Besonderheiten).
2. **Recherche-Pipeline** (serverseitig) — für jede Kategorie ein eigener, fokussierter Aufruf an
   Perplexity Sonar (Websuche ist im Modell eingebaut). Jede Antwort wird als striktes JSON
   gefordert und mit [Zod](https://zod.dev) validiert (`src/lib/schemas.ts`). Buchungslinks werden
   zusätzlich gegen die von Perplexity mitgelieferten Quellenangaben (`citations`) geprüft — ein
   Link, der zu keiner echten Quelle passt, wird verworfen statt erfunden anzuzeigen. Schlägt eine
   Kategorie fehl, wird einmal mit vereinfachtem Prompt erneut versucht; bleibt es dabei, zeigt das
   Dashboard einen Hinweis statt zu crashen.
3. **Dashboard** (`/trip/[id]`) — Hero-Banner + 7 Tabs (Übersicht, Flüge, Unterkünfte, Aktivitäten,
   Tagesplan, Budget, Insider-Tipps). Ohne `?edit=1` ist die Seite die read-only Share-Ansicht; mit
   `?edit=1` (Link von der Startseite) gibt es zusätzlich „Neu recherchieren“-Buttons pro Kategorie.

### KI-Provider umschalten

Standardmäßig nutzt die App die Perplexity Sonar API. Alternativ lässt sich auf die Anthropic API
(Claude mit Web-Search-Tool) umschalten:

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=dein-anthropic-key
```

Ohne `AI_PROVIDER` (oder mit `AI_PROVIDER=perplexity`) wird immer Perplexity verwendet.

### Umgebungsvariablen

| Variable                   | Pflicht                       | Beschreibung                                                                                   |
| --------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `AI_PROVIDER`              | nein                           | `perplexity` (Standard) oder `anthropic`.                                                        |
| `PERPLEXITY_API_KEY`       | ja, außer `AI_PROVIDER=anthropic` | Serverseitig verwendet (`src/lib/ai/perplexityProvider.ts`), nie im Client-Bundle.              |
| `PPLX_MODEL`               | nein                           | Perplexity-Modell, Standard `sonar` (das günstigste).                                            |
| `PPLX_SEARCH_CONTEXT_SIZE` | nein                           | `low` (Standard, günstigste Option), `medium` oder `high`.                                       |
| `ANTHROPIC_API_KEY`        | nur bei `AI_PROVIDER=anthropic` | Serverseitig verwendet (`src/lib/ai/anthropicProvider.ts`), nie im Client-Bundle.                |
| `DATABASE_URL`             | ja                             | SQLite-Verbindung, z.B. `file:./dev.db`.                                                          |
| `CREATE_TRIP_PASSWORD`     | nein                           | Wenn gesetzt, muss dieses Passwort beim Anlegen einer neuen Reise angegeben werden. Bestehende/geteilte Reisen bleiben ohne Login einsehbar. |

### Recherche-Pipeline manuell testen

Die Pipeline lässt sich direkt über die API anstoßen (z.B. mit dem Lissabon-Beispiel aus der
ursprünglichen Aufgabenstellung):

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
Recherche-Fortschritt live (Polling alle 2,5s) und danach das fertige Dashboard.

### Projektstruktur

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
    ai/
      index.ts                Provider-Umschaltung (AI_PROVIDER)
      perplexityProvider.ts   Perplexity-Sonar-Client (Websuche eingebaut, citations-Prüfung)
      anthropicProvider.ts    Claude-Client (Web-Search-Tool) als Alternative
      jsonExtract.ts           JSON-Parsing + Buchungslink-Validierung gegen citations
    research/
      prompts.ts              Prompt-Vorlagen pro Kategorie
      pipeline.ts              Orchestrierung: recherchieren, validieren, persistieren
    prisma.ts                  Prisma-Client (better-sqlite3-Adapter)
prisma/
  schema.prisma                Datenmodell (ein `Trip`-Model, Recherche-Ergebnisse als JSON)
```

## Deployment auf einem eigenen Server (statt Cloudflare Tunnel)

Der Cloudflare Tunnel aus Schritt (g) reicht für privates Teilen, solange dein Rechner läuft.
Für einen dauerhaft erreichbaren Server:

**Wichtig: SQLite + Serverless (z.B. Vercel) passt nicht zusammen.** Auf den meisten
Serverless-Plattformen ist das Dateisystem read-only bzw. flüchtig — jede Instanz bekäme ihre
eigene, leere SQLite-Datei, und Schreibzugriffe würden fehlschlagen oder beim nächsten Kaltstart
verloren gehen. Außerdem läuft die Recherche-Pipeline bewusst als „Fire-and-forget“-Task auf dem
Node-Prozess weiter, nachdem die HTTP-Antwort schon zurück ist — das setzt einen langlebigen
Prozess voraus, den Serverless-Functions nicht bieten.

**Empfohlen: ein kleiner, dauerhaft laufender Node-Server** (VPS, Fly.io, Railway, Render, ein
eigener Container o.ä.):

1. `npm run build`
2. `npm run db:deploy` (führt `prisma migrate deploy` aus, legt/aktualisiert die SQLite-Datei)
3. `npm run start` — persistent laufen lassen (z.B. via `pm2`, `systemd` oder im Docker-Container)
4. `PERPLEXITY_API_KEY`, `DATABASE_URL` (z.B. auf ein persistentes Volume zeigend) und optional
   `CREATE_TRIP_PASSWORD` als Umgebungsvariablen setzen
5. Die SQLite-Datei liegt auf einem persistenten Volume/Mount, damit sie Neustarts/Deploys übersteht

**Falls es unbedingt Vercel/Serverless sein soll:** SQLite gegen eine echte Netzwerk-Datenbank
tauschen — [Turso](https://turso.tech) (libSQL, SQLite-kompatibel, minimaler Migrationsaufwand:
Prisma-Adapter `@prisma/adapter-libsql` statt `@prisma/adapter-better-sqlite3`) oder Postgres
(`@prisma/adapter-pg` + `provider = "postgresql"` in `prisma/schema.prisma`) sind die naheliegendsten
Optionen. Zusätzlich müsste die Recherche-Pipeline von „Fire-and-forget im selben Prozess“ auf eine
Queue/einen Cron-/Background-Job umgestellt werden (z.B. Vercel Queues, Inngest, QStash), da
Serverless-Functions nach der Response keine Hintergrundarbeit garantieren.

## Bekannte Grenzen

- Keine Nutzerkonten — jede Reise ist über ihre (schwer erratbare) ID erreichbar; der optionale
  `CREATE_TRIP_PASSWORD` schützt nur das *Erstellen* neuer Reisen, nicht das Lesen bestehender.
- Preise/Verfügbarkeiten stammen aus Web-Suchergebnissen zum Recherchezeitpunkt und können sich
  seitdem geändert haben — vor der Buchung immer auf der Zielseite gegenprüfen.
- Die Recherche-Pipeline läuft „fire-and-forget“ auf dem Node-Prozess; bei einem Server-Neustart
  während einer laufenden Recherche bleibt die Reise im Status `RESEARCHING` hängen (über
  „Neu recherchieren“ pro Kategorie bzw. `POST /api/trips/[id]/research` erneut anstoßbar).

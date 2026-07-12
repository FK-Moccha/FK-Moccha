# Voyage — Reiseplaner

Next.js (App Router, TS) + Tailwind + Prisma/SQLite + Anthropic API (Claude, web search tool).
See README.md for setup, architecture, and deployment notes.

- `src/lib/schemas.ts` — Zod schemas for the briefing and every research category; the source of truth for data shapes.
- `src/lib/research/` — prompts + pipeline that call Claude and validate/persist results.
- `src/lib/prisma.ts` — Prisma client using the `@prisma/adapter-better-sqlite3` driver adapter (required by the Prisma 7 `prisma-client` generator).
- Run `npm run db:migrate` after changing `prisma/schema.prisma`.

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "destination" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "flexibleDates" BOOLEAN NOT NULL DEFAULT false,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "budgetTotal" INTEGER,
    "bestValue" BOOLEAN NOT NULL DEFAULT false,
    "travelStyles" TEXT NOT NULL DEFAULT '[]',
    "briefing" TEXT NOT NULL,
    "flights" TEXT,
    "hotels" TEXT,
    "activities" TEXT,
    "transfer" TEXT,
    "restaurants" TEXT,
    "itinerary" TEXT,
    "budget" TEXT,
    "insiderTips" TEXT,
    "researchErrors" TEXT NOT NULL DEFAULT '{}'
);

-- CreateIndex
CREATE INDEX "Trip_status_idx" ON "Trip"("status");

-- CreateIndex
CREATE INDEX "Trip_createdAt_idx" ON "Trip"("createdAt");

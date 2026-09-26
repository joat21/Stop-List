-- CreateTable
CREATE TABLE "StopListEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dishId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "stoppedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "returnedAt" DATETIME
);

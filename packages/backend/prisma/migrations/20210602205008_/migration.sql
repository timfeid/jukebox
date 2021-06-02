-- CreateTable
CREATE TABLE "PreviousSearches" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreviousSearches.query_unique" ON "PreviousSearches"("query");

-- CreateTable
CREATE TABLE "PreviousPlays" (
    "title" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "albumArt" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("youtubeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreviousPlays.youtubeId_unique" ON "PreviousPlays"("youtubeId");

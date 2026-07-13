-- CreateTable
CREATE TABLE "MemoryChunk" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keyFacts" JSONB NOT NULL,
    "keyFactsPinned" JSONB NOT NULL,
    "mood" TEXT NOT NULL,
    "npcsEvolution" JSONB NOT NULL,
    "turnRangeStart" INTEGER NOT NULL,
    "turnRangeEnd" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemoryChunk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemoryChunk" ADD CONSTRAINT "MemoryChunk_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

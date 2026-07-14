-- CreateTable
CREATE TABLE "Chronicle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "endReason" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bodyMarkdown" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "keyMoments" JSONB NOT NULL,
    "tagline" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chronicle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chronicle" ADD CONSTRAINT "Chronicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

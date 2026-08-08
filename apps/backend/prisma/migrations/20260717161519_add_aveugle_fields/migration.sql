-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "iron" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "aveugleSeenTopics" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Souvenir" ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aveugleLoreResult" TEXT;

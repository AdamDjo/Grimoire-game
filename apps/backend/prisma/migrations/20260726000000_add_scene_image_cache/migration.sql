-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN IF NOT EXISTS "currentImageUrl" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "SceneImage" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "cacheKey" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SceneImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "SceneImage_cacheKey_key" ON "SceneImage"("cacheKey");

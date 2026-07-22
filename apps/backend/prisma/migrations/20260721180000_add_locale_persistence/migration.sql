-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredLocale" TEXT;

-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en';

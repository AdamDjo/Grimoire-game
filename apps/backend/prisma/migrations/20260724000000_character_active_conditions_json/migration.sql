ALTER TABLE "Character" DROP COLUMN "conditions";
ALTER TABLE "Character" ADD COLUMN "activeConditions" JSONB NOT NULL DEFAULT '[]'::jsonb;

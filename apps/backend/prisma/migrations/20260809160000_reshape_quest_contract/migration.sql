-- Reshape the run contract so the board is not a list of dungeons (#260).
-- @see docs/public/raw/23-RUN-STRUCTURE.md §1, §2
--
-- Every column is added nullable: existing rows carry an accepted contract that
-- must keep reading back, and `readContract` treats a missing family as the
-- dungeon it was. `contractTargetDepth` was already nullable and now stays null
-- for every family but `dungeon`.
ALTER TABLE "GameSession" ADD COLUMN "contractFamily" TEXT;
ALTER TABLE "GameSession" ADD COLUMN "contractCommissioner" TEXT;
ALTER TABLE "GameSession" ADD COLUMN "contractDanger" TEXT;
ALTER TABLE "GameSession" ADD COLUMN "contractDuration" TEXT;
ALTER TABLE "GameSession" ADD COLUMN "contractSuccessCondition" TEXT;
ALTER TABLE "GameSession" ADD COLUMN "contractFailureConditions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Contracts written before this migration were all dungeons. Naming that
-- explicitly beats leaving the engine to infer it from a null forever.
UPDATE "GameSession" SET "contractFamily" = 'dungeon' WHERE "contractId" IS NOT NULL;

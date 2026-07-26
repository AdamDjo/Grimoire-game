ALTER TABLE "Character"
  ADD COLUMN "customVocationName" TEXT,
  ADD COLUMN "narrativeTrait" TEXT,
  ADD COLUMN "shiftedSkills" JSONB DEFAULT '[]';

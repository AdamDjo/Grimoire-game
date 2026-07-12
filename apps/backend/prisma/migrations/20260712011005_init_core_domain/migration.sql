-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "people" TEXT NOT NULL,
    "vocation" TEXT NOT NULL,
    "freeConcept" TEXT,
    "backstory" TEXT,
    "avatarUrl" TEXT,
    "blood" INTEGER NOT NULL,
    "breath" INTEGER NOT NULL,
    "ash" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "maxHp" INTEGER NOT NULL,
    "thirst" INTEGER NOT NULL,
    "hunger" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "calamine" INTEGER NOT NULL,
    "conditions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "turnNumber" INTEGER NOT NULL DEFAULT 1,
    "location" TEXT NOT NULL DEFAULT 'auberge-aveugle',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SceneLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "turnNumber" INTEGER NOT NULL,
    "sceneType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "narrative" TEXT NOT NULL,
    "choices" JSONB NOT NULL,
    "chosenChoice" JSONB,
    "consequences" JSONB,
    "diceRoll" JSONB,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SceneLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneLog" ADD CONSTRAINT "SceneLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;


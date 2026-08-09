-- Comptoir (#249) : transactions d'achat persistées et idempotentes.
-- L'unicité (characterId, purchaseId) est le garde-fou de concurrence : deux
-- requêtes simultanées portant le même purchaseId se disputent cet index, la
-- perdante reçoit P2002 et rejoue le résultat de la gagnante au lieu de
-- débiter le fer une seconde fois.

CREATE TABLE "CounterPurchase" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "lines" JSONB NOT NULL,
    "totalIron" INTEGER NOT NULL,
    "ironAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CounterPurchase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CounterPurchase_characterId_purchaseId_key"
    ON "CounterPurchase"("characterId", "purchaseId");

ALTER TABLE "CounterPurchase"
    ADD CONSTRAINT "CounterPurchase_characterId_fkey"
    FOREIGN KEY ("characterId") REFERENCES "Character"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Même posture que la migration 20260726120000 : l'accès applicatif passe par
-- Prisma (rôle postgres, BYPASSRLS) ; on ferme la porte à anon/authenticated.
ALTER TABLE "CounterPurchase" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_all_anon_authenticated" ON "CounterPurchase"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

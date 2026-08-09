-- #249 : la monnaie de Velkhar devient l'or (décision produit du 2026-08-09).
--
-- RENAME COLUMN et non drop/create : les colonnes portent des données de jeu
-- (le fer gagné en combat), et un drop les perdrait. Le rename est atomique et
-- préserve valeurs, contraintes et index.
ALTER TABLE "Character" RENAME COLUMN "iron" TO "gold";
ALTER TABLE "GameSession" RENAME COLUMN "contractRewardIron" TO "contractRewardGold";
ALTER TABLE "CounterPurchase" RENAME COLUMN "totalIron" TO "totalGold";
ALTER TABLE "CounterPurchase" RENAME COLUMN "ironAfter" TO "goldAfter";

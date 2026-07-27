-- Row Level Security (#162) : le backend accède à Postgres via le rôle
-- `postgres` (Prisma, BYPASSRLS) et via la clé `service_role` (Storage) —
-- les deux bypassent RLS par nature. Ces policies ne bloquent donc que les
-- rôles PostgREST `anon`/`authenticated`, c'est-à-dire un accès direct
-- depuis le SDK client Supabase, qui n'existe pas dans l'architecture
-- actuelle (le frontend passe toujours par l'API Express). Autorisation
-- applicative réelle : filtrage `userId` explicite côté Express (AUTH.md).

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Character" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GameSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SceneLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MemoryChunk" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Souvenir" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Chronicle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SceneImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_all_anon_authenticated" ON "User"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny_all_anon_authenticated" ON "Character"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny_all_anon_authenticated" ON "GameSession"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny_all_anon_authenticated" ON "SceneLog"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny_all_anon_authenticated" ON "MemoryChunk"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny_all_anon_authenticated" ON "Souvenir"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny_all_anon_authenticated" ON "Chronicle"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny_all_anon_authenticated" ON "SceneImage"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny_all_anon_authenticated" ON "_prisma_migrations"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

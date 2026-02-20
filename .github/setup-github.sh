#!/bin/bash
# Script d'initialisation GitHub : labels + milestones
# Usage: GITHUB_TOKEN=xxx bash .github/setup-github.sh

REPO="AdamDjo/EpisodeRPG-game"
TOKEN="${GITHUB_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo "GITHUB_TOKEN manquant. Usage: GITHUB_TOKEN=xxx bash .github/setup-github.sh"
  exit 1
fi

create_label() {
  local name="$1" color="$2" description="$3"
  curl -s -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/labels" \
    -d "{\"name\":\"$name\",\"color\":\"$color\",\"description\":\"$description\"}" \
    | grep -q '"id"' && echo "  OK: $name" || echo "  SKIP (existe): $name"
}

create_milestone() {
  local title="$1" description="$2" due="$3"
  curl -s -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/milestones" \
    -d "{\"title\":\"$title\",\"description\":\"$description\",\"due_on\":\"${due}T00:00:00Z\"}" \
    | grep -q '"id"' && echo "  OK: $title" || echo "  SKIP (existe): $title"
}

echo "=== Labels ==="
# Phases
create_label "phase-1a"  "0075ca" "Phase 1A - Frontend UI (Week 1-5)"
create_label "phase-1b"  "0052cc" "Phase 1B - Backend Foundation (Week 4-6)"
create_label "phase-2"   "003d8f" "Phase 2 - Integration (Week 7-10)"
create_label "phase-2b"  "e4e669" "Phase 2B - Addictive Features (Week 11-16)"
create_label "phase-3"   "f9d0c4" "Phase 3 - Polish & UGC (Week 17+)"
# Domaines
create_label "frontend"  "bfd4f2" "Frontend (Next.js)"
create_label "backend"   "d4c5f9" "Backend (Express)"
create_label "shared"    "c2e0c6" "Shared types/constants"
create_label "ai"        "fef2c0" "AI integration"
create_label "database"  "f9d0c4" "Database / Supabase"
create_label "devops"    "e4e669" "CI/CD, GitHub Actions"
# Types
create_label "bug"       "d73a4a" "Quelque chose ne fonctionne pas"
create_label "release"   "0e8a16" "Release branch PR"
create_label "blocked"   "e11d48" "Bloqué par une dépendance"
create_label "priority"  "ff6b35" "Priorité haute"

echo ""
echo "=== Milestones ==="
create_milestone "Phase 1A - Frontend UI"       "All frontend pages static, no API calls" "2026-03-21"
create_milestone "Phase 1B - Backend Foundation" "Database schema + auth endpoints ready" "2026-04-04"
create_milestone "Phase 2 - MVP"                "Fully playable end-to-end (Fantasy)"    "2026-04-25"
create_milestone "Phase 2B - Multi-Universe"    "3 universes, 14 classes, highly replayable" "2026-06-06"
create_milestone "Phase 3 - Polish & UGC"       "Custom universes, cosmetics, community"  "2026-08-01"

echo ""
echo "Done! Recharge la page GitHub pour voir les changements."

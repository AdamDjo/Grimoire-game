#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; exit 1; }

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Grimoire — Project Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── 1. Check prerequisites ────────────────────────────────────────────────────

NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 20 ]; then
  fail "Node 20+ is required. Install it from https://nodejs.org"
fi
ok "Node $(node --version)"

if ! command -v pnpm &>/dev/null; then
  fail "pnpm is required. Install it with: npm install -g pnpm"
fi
ok "pnpm $(pnpm --version)"

if ! command -v git &>/dev/null; then
  fail "git is required. Install it from https://git-scm.com"
fi
ok "git $(git --version | awk '{print $3}')"

echo ""

# ── 2. Install dependencies ───────────────────────────────────────────────────

echo "Installing dependencies..."
pnpm install --frozen-lockfile
ok "Dependencies installed"
echo ""

# ── 3. Copy .env.example files ───────────────────────────────────────────────

copy_env() {
  local example="$1"
  local target="$2"
  local label="$3"

  if [ -f "$target" ]; then
    warn "$label already exists — skipped (not overwritten)"
  elif [ -f "$example" ]; then
    cp "$example" "$target"
    ok "$label created from .env.example"
  fi
}

copy_env "apps/backend/.env.example"  "apps/backend/.env"       "apps/backend/.env"
copy_env "apps/frontend/.env.example" "apps/frontend/.env.local" "apps/frontend/.env.local"
echo ""

# ── 4. Setup Husky git hooks ──────────────────────────────────────────────────

if [ -d ".git" ]; then
  pnpm husky
  ok "Husky git hooks initialized"
else
  warn "No .git directory found — skipping Husky setup"
fi
echo ""

# ── Done ──────────────────────────────────────────────────────────────────────

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e " ${GREEN}Setup complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo " Next steps:"
echo "   1. Fill in your secrets in apps/backend/.env"
echo "   2. Fill in your secrets in apps/frontend/.env.local"
echo "   3. Run: pnpm dev"
echo ""

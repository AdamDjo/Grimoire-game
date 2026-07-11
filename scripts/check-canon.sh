#!/usr/bin/env bash
set -euo pipefail

CANON_DIR="docs/private/raw"

expected_files=(
  "00-SOMMAIRE.md"
  "01-PILLARS.md"
  "02-WORLD-BIBLE.md"
  "03-BESTIARY.md"
  "03-FACTIONS.md"
  "04-ATTRIBUTES.md"
  "05-VOCATIONS.md"
  "06-SURVIVAL.md"
  "07-CHARACTER-CREATION.md"
  "08-DICE-RESOLUTION.md"
  "09-ACTION-LOOP.md"
  "10-COMBAT.md"
  "11-INVENTORY-ECONOMY.md"
  "12-NPCS-RELATIONS.md"
  "13-REPUTATION.md"
  "14-META-WORLD.md"
  "15-GAME-MASTER.md"
  "16-MEMORY.md"
  "17-RUN-CHRONICLE.md"
  "18-RETENTION.md"
  "19-MONETIZATION.md"
  "20-ARCHITECTURE.md"
  "21-ROADMAP.md"
  "22-GLOSSARY.md"
  "_STATUS.md"
)

if [[ ! -d "$CANON_DIR" ]]; then
  echo "Canon missing: $CANON_DIR does not exist."
  exit 1
fi

missing=()

for file in "${expected_files[@]}"; do
  if [[ ! -f "$CANON_DIR/$file" ]]; then
    missing+=("$file")
  fi
done

if (( ${#missing[@]} > 0 )); then
  echo "Canon incomplete: ${#missing[@]} file(s) missing from $CANON_DIR."
  printf ' - %s\n' "${missing[@]}"
  exit 1
fi

echo "Canon OK: ${#expected_files[@]} private files present in $CANON_DIR."

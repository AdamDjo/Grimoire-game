import assert from "node:assert/strict";
import test from "node:test";

import {
  hasValidExemption,
  missingCurrentStateFiles,
  requiredCurrentStateFiles,
} from "./check-current-state.mjs";

const FRONTEND_PAIR = [
  "docs/public/current-state/FRONTEND_STATUS.md",
  "docs/public/current-state/FRONTEND_NEXT.md",
];

const BACKEND_PAIR = [
  "docs/public/current-state/BACKEND_STATUS.md",
  "docs/public/current-state/BACKEND_NEXT.md",
];

test("ignore une PR documentaire ou tooling", () => {
  assert.deepEqual(requiredCurrentStateFiles(["docs/00-START-HERE.md"]), []);
  assert.deepEqual(requiredCurrentStateFiles([".github/workflows/pr.yml"]), []);
});

test("requiert la paire frontend", () => {
  assert.deepEqual(
    requiredCurrentStateFiles(["apps/frontend/src/app/page.tsx"]),
    FRONTEND_PAIR,
  );
});

test("requiert la paire backend pour backend et shared", () => {
  assert.deepEqual(
    requiredCurrentStateFiles(["apps/backend/src/index.ts"]),
    BACKEND_PAIR,
  );
  assert.deepEqual(
    requiredCurrentStateFiles(["packages/shared/src/index.ts"]),
    BACKEND_PAIR,
  );
});

test("requiert les deux paires pour une PR cross-domain", () => {
  assert.deepEqual(
    requiredCurrentStateFiles([
      "apps/frontend/src/app/page.tsx",
      "packages/shared/src/index.ts",
    ]),
    [...FRONTEND_PAIR, ...BACKEND_PAIR],
  );
});

test("requiert release readiness pour une PR predeploy", () => {
  assert.deepEqual(
    requiredCurrentStateFiles(
      ["apps/backend/src/index.ts"],
      "- **Phase** : phase: predeploy",
    ),
    [...BACKEND_PAIR, "docs/public/current-state/RELEASE_READINESS.md"],
  );
});

test("ignore les exemples de phase laissés dans le template", () => {
  assert.deepEqual(
    requiredCurrentStateFiles(
      ["apps/backend/src/index.ts"],
      "Phases autorisées : `phase: predeploy` ou `phase: postdeploy`.",
    ),
    BACKEND_PAIR,
  );
});

test("signale uniquement les fichiers manquants", () => {
  assert.deepEqual(
    missingCurrentStateFiles([
      "apps/frontend/src/app/page.tsx",
      "docs/public/current-state/FRONTEND_STATUS.md",
    ]),
    ["docs/public/current-state/FRONTEND_NEXT.md"],
  );
});

test("accepte une exception cochée et justifiée", () => {
  const body = `- [x] Current-state non applicable
Justification current-state: refactor interne sans changement produit`;

  assert.equal(hasValidExemption(body), true);
  assert.deepEqual(
    requiredCurrentStateFiles(["apps/backend/src/index.ts"], body),
    [],
  );
});

test("refuse une exception sans justification réelle", () => {
  const body = `- [x] Current-state non applicable
Justification current-state: <!-- obligatoire -->`;

  assert.equal(hasValidExemption(body), false);
  assert.deepEqual(
    requiredCurrentStateFiles(["apps/backend/src/index.ts"], body),
    BACKEND_PAIR,
  );
});

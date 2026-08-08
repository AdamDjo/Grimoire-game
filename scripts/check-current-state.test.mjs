import assert from "node:assert/strict";
import test from "node:test";

import {
  currentStateViolations,
  declaresPredeployPhase,
  hasCrossDomainExemption,
} from "./check-current-state.mjs";

const FRONTEND = "docs/public/current-state/FRONTEND.md";
const BACKEND = "docs/public/current-state/BACKEND.md";
const RELEASE = "docs/public/current-state/RELEASE_READINESS.md";

test("une PR qui ne modifie aucun document est valide — c'est le défaut", () => {
  assert.deepEqual(currentStateViolations(["apps/backend/src/index.ts"]), []);
  assert.deepEqual(
    currentStateViolations(["apps/frontend/src/app/page.tsx"]),
    [],
  );
  assert.deepEqual(currentStateViolations(["packages/shared/src/index.ts"]), []);
});

test("un seul document de domaine passe", () => {
  assert.deepEqual(
    currentStateViolations(["apps/backend/src/index.ts", BACKEND]),
    [],
  );
  assert.deepEqual(
    currentStateViolations(["apps/frontend/src/app/page.tsx", FRONTEND]),
    [],
  );
});

test("refuse deux documents de domaine dans la même PR", () => {
  const violations = currentStateViolations([
    "packages/shared/src/index.ts",
    FRONTEND,
    BACKEND,
  ]);

  assert.equal(violations.length, 1);
  assert.match(violations[0], /Un seul document de domaine par PR/);
});

test("accepte deux documents de domaine si la refonte transverse est justifiée", () => {
  const body = `- [x] Refonte transverse des docs
Justification docs transverses: consolidation des paires STATUS/NEXT en un document par domaine`;

  assert.equal(hasCrossDomainExemption(body), true);
  assert.deepEqual(
    currentStateViolations(["packages/shared/src/index.ts", FRONTEND, BACKEND], body),
    [],
  );
});

test("refuse une refonte transverse sans justification réelle", () => {
  const body = `- [x] Refonte transverse des docs
Justification docs transverses: <!-- obligatoire -->`;

  assert.equal(hasCrossDomainExemption(body), false);
  assert.equal(currentStateViolations([FRONTEND, BACKEND], body).length, 1);
});

test("refuse la résurrection d'un fichier supprimé", () => {
  const violations = currentStateViolations([
    "docs/public/current-state/BACKEND_STATUS.md",
  ]);

  assert.equal(violations.length, 1);
  assert.match(violations[0], /supprimé le 2026-08-08/);
  assert.match(violations[0], /BACKEND\.md/);
});

test("oriente une résurrection frontend vers FRONTEND.md", () => {
  const violations = currentStateViolations([
    "docs/public/current-state/FRONTEND_NEXT.md",
  ]);

  assert.match(violations[0], /FRONTEND\.md/);
});

test("exige RELEASE_READINESS pour une PR predeploy", () => {
  const violations = currentStateViolations(
    ["apps/backend/src/index.ts"],
    "- **Phase** : phase: predeploy",
  );

  assert.equal(violations.length, 1);
  assert.match(violations[0], /RELEASE_READINESS\.md/);
});

test("une PR predeploy qui met à jour RELEASE_READINESS passe", () => {
  assert.deepEqual(
    currentStateViolations(
      ["apps/backend/src/index.ts", RELEASE],
      "- **Phase** : phase: predeploy",
    ),
    [],
  );
});

test("ignore les exemples de phase laissés dans le template", () => {
  assert.equal(
    declaresPredeployPhase(
      "Phases autorisées : `phase: predeploy` ou `phase: postdeploy`.",
    ),
    false,
  );
  assert.deepEqual(
    currentStateViolations(
      ["apps/backend/src/index.ts"],
      "Phases autorisées : `phase: predeploy` ou `phase: postdeploy`.",
    ),
    [],
  );
});

test("une PR documentaire predeploy n'exige pas RELEASE_READINESS", () => {
  assert.deepEqual(
    currentStateViolations(
      ["docs/00-START-HERE.md"],
      "- **Phase** : phase: predeploy",
    ),
    [],
  );
});

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const FRONTEND_STATUS_FILES = [
  "docs/public/current-state/FRONTEND_STATUS.md",
  "docs/public/current-state/FRONTEND_NEXT.md",
];

const BACKEND_STATUS_FILES = [
  "docs/public/current-state/BACKEND_STATUS.md",
  "docs/public/current-state/BACKEND_NEXT.md",
];

const RELEASE_STATUS_FILE = "docs/public/current-state/RELEASE_READINESS.md";

export function hasValidExemption(prBody) {
  const checked = /^- \[[xX]\] Current-state non applicable\s*$/m.test(prBody);
  const justification = prBody
    .match(/^Justification current-state:\s*(.+)$/m)?.[1]
    ?.trim();

  return Boolean(
    checked &&
    justification &&
    !justification.startsWith("<!--") &&
    justification.length >= 10,
  );
}

export function requiredCurrentStateFiles(changedFiles, prBody = "") {
  const hasFrontendCode = changedFiles.some((file) =>
    file.startsWith("apps/frontend/"),
  );
  const hasBackendCode = changedFiles.some((file) =>
    file.startsWith("apps/backend/"),
  );
  const hasSharedContract = changedFiles.some((file) =>
    file.startsWith("packages/shared/"),
  );
  const hasFunctionalCode =
    hasFrontendCode || hasBackendCode || hasSharedContract;

  if (!hasFunctionalCode || hasValidExemption(prBody)) {
    return [];
  }

  const required = new Set();

  if (hasFrontendCode) {
    FRONTEND_STATUS_FILES.forEach((file) => required.add(file));
  }

  if (hasBackendCode || hasSharedContract) {
    BACKEND_STATUS_FILES.forEach((file) => required.add(file));
  }

  if (/^- \*\*Phase\*\* : phase: predeploy\s*$/im.test(prBody)) {
    required.add(RELEASE_STATUS_FILE);
  }

  return [...required];
}

export function missingCurrentStateFiles(changedFiles, prBody = "") {
  const changed = new Set(changedFiles);
  return requiredCurrentStateFiles(changedFiles, prBody).filter(
    (file) => !changed.has(file),
  );
}

function changedFilesBetween(base, head) {
  const range = head === "HEAD" ? base : `${base}...${head}`;
  const output = execFileSync("git", ["diff", "--name-only", range], {
    encoding: "utf8",
  });

  return output
    .split("\n")
    .map((file) => file.trim())
    .filter(Boolean);
}

function run() {
  const args = process.argv.slice(2).filter((argument) => argument !== "--");
  const base = args[0] ?? "origin/develop";
  const head = args[1] ?? "HEAD";
  const prBody = process.env.PR_BODY ?? "";
  const changedFiles = changedFilesBetween(base, head);
  const required = requiredCurrentStateFiles(changedFiles, prBody);
  const missing = missingCurrentStateFiles(changedFiles, prBody);

  if (required.length === 0) {
    const reason = hasValidExemption(prBody)
      ? "exception explicite et justifiée"
      : "aucun changement fonctionnel frontend/backend/shared";
    console.log(`Current-state: non applicable (${reason}).`);
    return;
  }

  if (missing.length > 0) {
    console.error("Current-state incomplet. Fichiers requis dans cette PR :");
    missing.forEach((file) => console.error(`- ${file}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Current-state valide (${required.length} fichier(s) requis).`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  run();
}

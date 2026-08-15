import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// Consolidation du 2026-08-08 : GitHub porte l'avancement, les docs portent les
// décisions. Ce garde-fou ne réclame donc plus aucun document — il vérifie
// qu'une PR n'en modifie pas trop. Règle : docs/state/PROJECT_STATUS.md.
const FRONTEND_DOMAIN_FILE = "docs/state/FRONTEND.md";
const BACKEND_DOMAIN_FILE = "docs/state/BACKEND.md";
const RELEASE_STATUS_FILE = "docs/state/RELEASE_READINESS.md";

const DELETED_STATUS_FILES = [
  "docs/state/FRONTEND_STATUS.md",
  "docs/state/FRONTEND_NEXT.md",
  "docs/state/BACKEND_STATUS.md",
  "docs/state/BACKEND_NEXT.md",
  "docs/state/NEXT_ACTIONS.md",
];

export function declaresPredeployPhase(prBody) {
  return /^- \*\*Phase\*\* : phase: predeploy\s*$/im.test(prBody);
}

// Une refonte transverse assumée (consolidation, renommage de docs) touche
// légitimement les deux domaines. Elle doit le déclarer et le justifier.
export function hasCrossDomainExemption(prBody) {
  const checked = /^- \[[xX]\] Refonte transverse des docs\s*$/m.test(prBody);
  const justification = prBody
    .match(/^Justification docs transverses:\s*(.+)$/m)?.[1]
    ?.trim();

  return Boolean(
    checked &&
      justification &&
      !justification.startsWith("<!--") &&
      justification.length >= 10,
  );
}

export function currentStateViolations(changedFiles, prBody = "") {
  const changed = new Set(changedFiles);
  const violations = [];

  const resurrected = DELETED_STATUS_FILES.filter((file) => changed.has(file));

  resurrected.forEach((file) => {
    violations.push(
      `${file} a été supprimé le 2026-08-08 : écrire la décision dans ${
        file.startsWith("docs/state/FRONTEND")
          ? FRONTEND_DOMAIN_FILE
          : BACKEND_DOMAIN_FILE
      }.`,
    );
  });

  if (
    changed.has(FRONTEND_DOMAIN_FILE) &&
    changed.has(BACKEND_DOMAIN_FILE) &&
    !hasCrossDomainExemption(prBody)
  ) {
    violations.push(
      `Un seul document de domaine par PR : ${FRONTEND_DOMAIN_FILE} et ${BACKEND_DOMAIN_FILE} sont modifiés tous les deux.`,
    );
  }

  const withUpdatedField = [
    FRONTEND_DOMAIN_FILE,
    BACKEND_DOMAIN_FILE,
    RELEASE_STATUS_FILE,
  ].filter((file) => changed.has(file) && hasUpdatedField(file));

  withUpdatedField.forEach((file) => {
    violations.push(
      `${file} contient un champ \`updated:\` : la date fiable est \`git log -1 --format=%cs -- ${file}\`.`,
    );
  });

  const touchesPredeployBlocker =
    declaresPredeployPhase(prBody) &&
    changedFiles.some(
      (file) =>
        file.startsWith("apps/") || file.startsWith("packages/shared/"),
    );

  if (touchesPredeployBlocker && !changed.has(RELEASE_STATUS_FILE)) {
    violations.push(
      `PR déclarée \`phase: predeploy\` : ${RELEASE_STATUS_FILE} doit refléter l'état attendu après merge.`,
    );
  }

  return violations;
}

function hasUpdatedField(file) {
  try {
    const content = execFileSync("git", ["show", `HEAD:${file}`], {
      encoding: "utf8",
    });
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1];
    return frontmatter ? /^updated:/m.test(frontmatter) : false;
  } catch {
    return false;
  }
}

// Une PR qui *supprime* un fichier ne le « ressuscite » pas : seuls les
// ajouts et modifications comptent comme une écriture de document.
function changedFilesBetween(base, head) {
  const range = head === "HEAD" ? base : `${base}...${head}`;
  const output = execFileSync(
    "git",
    ["diff", "--name-status", "--diff-filter=d", range],
    { encoding: "utf8" },
  );

  return output
    .split("\n")
    .map((line) => line.trim().split("\t").at(-1)?.trim())
    .filter(Boolean);
}

function run() {
  const args = process.argv.slice(2).filter((argument) => argument !== "--");
  const base = args[0] ?? "origin/develop";
  const head = args[1] ?? "HEAD";
  const prBody = process.env.PR_BODY ?? "";
  const changedFiles = changedFilesBetween(base, head);
  const violations = currentStateViolations(changedFiles, prBody);

  if (violations.length > 0) {
    console.error("Tenue des docs non respectée :");
    violations.forEach((violation) => console.error(`- ${violation}`));
    console.error(
      "\nRègle : docs/state/PROJECT_STATUS.md § Règle de tenue des docs.",
    );
    process.exitCode = 1;
    return;
  }

  console.log("Tenue des docs valide (aucun document requis par défaut).");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  run();
}

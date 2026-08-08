import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// « Chaque PR remet à jour le statut » — mais dans la PR, jamais dans un `.md`.
// Le statut est régénéré depuis GitHub à chaque push : il ne peut pas être périmé,
// et aucun document n'est édité à la main. Règle : PROJECT_STATUS.md § Règle de tenue des docs.
export const MILESTONE = "v0.2.1 - Roguelike jouable";
export const MARKER = "<!-- grimoire:project-status -->";

// Ordre de dépendance des EPICs : chacun suppose le précédent livré.
// Source : docs/public/current-state/PROJECT_STATUS.md § Ordre des EPICs.
const EPIC_ORDER = [214, 215, 216, 217, 218, 219, 220, 221];

export function summarize(issues) {
  const epics = [];
  const tickets = [];

  issues.forEach((issue) => {
    if (issue.title.startsWith("[EPIC]")) {
      epics.push(issue);
    } else {
      tickets.push(issue);
    }
  });

  const byNumber = (a, b) => a.number - b.number;
  const closed = tickets.filter((t) => t.state === "CLOSED").sort(byNumber);
  const open = tickets.filter((t) => t.state !== "CLOSED").sort(byNumber);

  return { epics, tickets, closed, open };
}

export function renderStatus(issues, { milestone = MILESTONE } = {}) {
  const { epics, tickets, closed, open } = summarize(issues);
  const total = tickets.length;
  const done = closed.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const filled = total === 0 ? 0 : Math.round((done / total) * 20);
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);

  const lines = [
    MARKER,
    `## 📍 Statut du projet — ${milestone}`,
    "",
    `\`${bar}\` **${done}/${total}** tickets fermés (${percent} %)`,
    "",
  ];

  const orderedEpics = [...epics].sort(
    (a, b) => EPIC_ORDER.indexOf(a.number) - EPIC_ORDER.indexOf(b.number),
  );

  if (orderedEpics.length > 0) {
    lines.push("### EPICs — chaque EPIC suppose le précédent livré", "");
    orderedEpics.forEach((epic) => {
      const icon = epic.state === "CLOSED" ? "✅" : "⬜";
      const title = epic.title.replace(/^\[EPIC\]\s*/, "");
      lines.push(`${icon} **#${epic.number}** ${title}`);
    });
    lines.push("");
  }

  if (open.length > 0) {
    lines.push("### Tickets ouverts", "");
    open.forEach((ticket) => {
      const blocked = ticket.labels?.some(
        (label) => label.name === "status: blocked",
      );
      lines.push(
        `- ${blocked ? "🚧" : "•"} #${ticket.number} ${ticket.title}${
          blocked ? " _(bloqué)_" : ""
        }`,
      );
    });
    lines.push("");
  }

  if (closed.length > 0) {
    lines.push(
      `<details><summary>${closed.length} ticket(s) fermé(s)</summary>`,
      "",
    );
    closed.forEach((ticket) => {
      lines.push(`- ✅ #${ticket.number} ${ticket.title}`);
    });
    lines.push("", "</details>", "");
  }

  lines.push(
    "---",
    "",
    "_Généré depuis les issues GitHub à chaque push. GitHub porte l'avancement, les docs portent les",
    "décisions — aucun `.md` n'est modifié par ce commentaire._",
  );

  return lines.join("\n");
}

function gh(args) {
  return execFileSync("gh", args, { encoding: "utf8" });
}

function fetchIssues(repo, milestone) {
  const output = gh([
    "issue",
    "list",
    "--repo",
    repo,
    "--milestone",
    milestone,
    "--state",
    "all",
    "--limit",
    "100",
    "--json",
    "number,title,state,labels",
  ]);

  return JSON.parse(output);
}

function findExistingComment(repo, prNumber) {
  const output = gh([
    "api",
    `repos/${repo}/issues/${prNumber}/comments`,
    "--paginate",
    "--jq",
    `.[] | select(.body | contains("${MARKER}")) | .id`,
  ]);

  return output.trim().split("\n").filter(Boolean)[0];
}

function run() {
  const repo = process.env.REPO;
  const prNumber = process.env.PR_NUMBER;
  const milestone = process.env.MILESTONE ?? MILESTONE;

  if (!repo || !prNumber) {
    console.error("REPO et PR_NUMBER sont requis.");
    process.exitCode = 1;
    return;
  }

  const issues = fetchIssues(repo, milestone);

  if (issues.length === 0) {
    console.log(`Milestone "${milestone}" vide ou inconnu : aucun statut posté.`);
    return;
  }

  const body = renderStatus(issues, { milestone });
  const existing = findExistingComment(repo, prNumber);

  if (existing) {
    gh([
      "api",
      "-X",
      "PATCH",
      `repos/${repo}/issues/comments/${existing}`,
      "-f",
      `body=${body}`,
    ]);
    console.log(`Statut mis à jour (commentaire ${existing}).`);
    return;
  }

  gh([
    "api",
    "-X",
    "POST",
    `repos/${repo}/issues/${prNumber}/comments`,
    "-f",
    `body=${body}`,
  ]);
  console.log(`Statut posté sur la PR #${prNumber}.`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  run();
}

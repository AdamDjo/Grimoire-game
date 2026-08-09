import { access, lstat, readFile, readlink } from "node:fs/promises";

const PROJECT_SKILLS = [
  "bug",
  "check",
  "design-taste-frontend",
  "feature",
  "hotfix",
  "implement",
  "pr",
  "release",
  "status",
  "sync",
];

const REQUIRED_FILES = [
  "MEMORY.md",
  "AGENTS.md",
  "CLAUDE.md",
  "docs/00-START-HERE.md",
  "docs/state/PROJECT_STATUS.md",
  "docs/state/RELEASE_READINESS.md",
  "docs/tech/AI_SETUP.md",
  "docs/task-router.md",
  ".claude/agents/backend-dev/agent.md",
  ".claude/agents/code-reviewer/agent.md",
  ".claude/agents/frontend-dev/agent.md",
  ...PROJECT_SKILLS.flatMap((skill) => [
    `.claude/skills/${skill}/SKILL.md`,
    `.agents/skills/${skill}/SKILL.md`,
  ]),
];

const missingFiles = [];
const invalidSkills = [];
const invalidClaudeLinks = [];

for (const file of REQUIRED_FILES) {
  try {
    await access(file);
  } catch {
    missingFiles.push(file);
  }
}

for (const skill of PROJECT_SKILLS) {
  const canonicalFile = `.agents/skills/${skill}/SKILL.md`;
  const claudeLink = `.claude/skills/${skill}`;
  const expectedTarget = `../../.agents/skills/${skill}`;

  try {
    const content = await readFile(canonicalFile, "utf8");
    if (!content.includes(`name: ${skill}`)) invalidSkills.push(canonicalFile);
  } catch {
    // Le fichier est déjà signalé comme manquant ci-dessus.
  }

  try {
    const [stats, target] = await Promise.all([
      lstat(claudeLink),
      readlink(claudeLink),
    ]);
    if (!stats.isSymbolicLink() || target !== expectedTarget)
      invalidClaudeLinks.push(claudeLink);
  } catch {
    invalidClaudeLinks.push(claudeLink);
  }
}

if (
  missingFiles.length > 0 ||
  invalidSkills.length > 0 ||
  invalidClaudeLinks.length > 0
) {
  if (missingFiles.length > 0) {
    console.error(
      `Fichiers mémoire projet manquants :\n- ${missingFiles.join("\n- ")}`,
    );
  }

  if (invalidSkills.length > 0) {
    console.error(`Skills sans nom attendu :\n- ${invalidSkills.join("\n- ")}`);
  }

  if (invalidClaudeLinks.length > 0) {
    console.error(
      `Liens Claude vers les skills canoniques invalides :\n- ${invalidClaudeLinks.join("\n- ")}`,
    );
  }

  process.exit(1);
}

console.log(
  `Mémoire projet valide (${REQUIRED_FILES.length} fichiers, ${PROJECT_SKILLS.length} skills canoniques partagés).`,
);

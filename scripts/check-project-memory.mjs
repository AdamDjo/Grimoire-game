import { access, readFile } from "node:fs/promises";

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
  "docs/00-HOME.md",
  "docs/00-START-HERE.md",
  "docs/public/current-state/PROJECT_STATUS.md",
  "docs/public/current-state/RELEASE_READINESS.md",
  "docs/public/nav/AI_WORKFLOW.md",
  "docs/public/nav/task-router.md",
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

for (const file of REQUIRED_FILES) {
  try {
    await access(file);
  } catch {
    missingFiles.push(file);
  }
}

for (const skill of PROJECT_SKILLS) {
  for (const root of [".claude/skills", ".agents/skills"]) {
    const file = `${root}/${skill}/SKILL.md`;

    try {
      const content = await readFile(file, "utf8");
      if (!content.includes(`name: ${skill}`)) invalidSkills.push(file);
    } catch {
      // Le fichier est déjà signalé comme manquant ci-dessus.
    }
  }
}

if (missingFiles.length > 0 || invalidSkills.length > 0) {
  if (missingFiles.length > 0) {
    console.error(
      `Fichiers mémoire projet manquants :\n- ${missingFiles.join("\n- ")}`,
    );
  }

  if (invalidSkills.length > 0) {
    console.error(`Skills sans nom attendu :\n- ${invalidSkills.join("\n- ")}`);
  }

  process.exit(1);
}

console.log(
  `Mémoire projet valide (${REQUIRED_FILES.length} fichiers, ${PROJECT_SKILLS.length} skills doubles).`,
);

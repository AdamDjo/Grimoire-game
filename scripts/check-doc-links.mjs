import { readdirSync, readFileSync, statSync } from "node:fs";
import {
  basename,
  dirname,
  extname,
  join,
  normalize,
  relative,
  resolve,
} from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_ROOT = join(PROJECT_ROOT, "docs");

/**
 * Dossiers du vault non versionnés : leurs liens ne sont pas auditables en CI,
 * où le dossier n'existe simplement pas.
 */
const UNTRACKED_DIRECTORIES = new Set(["private"]);

function markdownFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    if (UNTRACKED_DIRECTORIES.has(entry)) return [];
    const path = join(directory, entry);
    return statSync(path).isDirectory()
      ? markdownFiles(path)
      : extname(path) === ".md"
        ? [path]
        : [];
  });
}

function withoutExtension(path) {
  return path.endsWith(".md") ? path.slice(0, -3) : path;
}

function normalizeTarget(rawTarget) {
  return rawTarget.split("|")[0].split("#")[0].trim();
}

function candidatePaths(source, target) {
  const withExtension = target.endsWith(".md") ? target : `${target}.md`;
  return [
    resolve(dirname(source), withExtension),
    resolve(DOCS_ROOT, withExtension),
  ].map(normalize);
}

export function unresolvedWikiLinks(files) {
  const normalizedFiles = new Set(files.map(normalize));
  const filesByStem = new Map();

  files.forEach((file) => {
    const stem = basename(withoutExtension(file));
    const matches = filesByStem.get(stem) ?? [];
    matches.push(normalize(file));
    filesByStem.set(stem, matches);
  });

  return files.flatMap((source) => {
    const content = readFileSync(source, "utf8");
    const targets = [...content.matchAll(/!?\[\[([^\]]+)\]\]/g)]
      .map((match) => normalizeTarget(match[1]))
      .filter(Boolean);

    return targets.flatMap((target) => {
      const directMatch = candidatePaths(source, target).some((candidate) =>
        normalizedFiles.has(candidate),
      );
      const stemMatches =
        filesByStem.get(basename(withoutExtension(target))) ?? [];

      if (directMatch || stemMatches.length === 1) {
        return [];
      }

      return [{ source: relative(PROJECT_ROOT, source), target }];
    });
  });
}

function run() {
  const files = markdownFiles(DOCS_ROOT);
  const unresolved = unresolvedWikiLinks(files);

  if (unresolved.length > 0) {
    console.error("Wikilinks publics non résolus :");
    unresolved.forEach(({ source, target }) =>
      console.error(`- ${source}: [[${target}]]`),
    );
    process.exitCode = 1;
    return;
  }

  console.log(`Wikilinks publics valides (${files.length} fichiers audités).`);
}

run();

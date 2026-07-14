#!/usr/bin/env node
// Validate a skill directory against the Agent Skills specification and this
// skill's house rules. Zero-dependency companion to the official skills-ref
// validator, usable anywhere Node exists.
//
// Usage: node scripts/validate.mjs <skill-root>
//
// Errors fail the run (exit 1). Warnings report house-rule findings that do
// not violate the specification.

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const SPEC_KEYS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);

if (process.argv.includes("--help")) {
  console.log("Usage: node scripts/validate.mjs <skill-root>\nValidates a skill directory against the Agent Skills specification. Exits 1 on errors.");
  process.exit(0);
}

const root = resolve(process.argv[2] ?? ".");
const errors = [];
const warnings = [];

const skillPath = join(root, "SKILL.md");
if (!existsSync(skillPath)) {
  console.error(`ERROR: no SKILL.md found in ${root}`);
  process.exit(1);
}

const raw = readFileSync(skillPath, "utf8");
const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
if (!fm) {
  console.error("ERROR: SKILL.md does not start with a YAML frontmatter block");
  process.exit(1);
}

// Minimal YAML subset parser: top-level "key: value" scalars plus one level of
// nested mapping (for metadata). Quoted and plain scalars only.
const fields = {};
let currentMap = null;
for (const line of fm[1].split(/\r?\n/)) {
  if (!line.trim() || line.trim().startsWith("#")) continue;
  const nested = line.match(/^\s+([\w-]+):\s*(.*)$/);
  const top = line.match(/^([\w-]+):\s*(.*)$/);
  const unquote = (v) => v.replace(/^"(.*)"$/s, "$1").replace(/^'(.*)'$/s, "$1");
  if (top) {
    const [, key, value] = top;
    if (/^[|>][+-]?$/.test(value.trim())) {
      errors.push(
        `\`${key}\` uses a block scalar, which this validator does not parse. Use a quoted single-line value`,
      );
      fields[key] = "";
      currentMap = null;
    } else if (value === "") {
      fields[key] = {};
      currentMap = fields[key];
    } else {
      fields[key] = unquote(value.trim());
      currentMap = null;
    }
  } else if (nested && currentMap) {
    currentMap[nested[1]] = unquote(nested[2].trim());
  }
}

if ("metadata" in fields && typeof fields.metadata !== "object")
  errors.push("`metadata` must be a mapping of string keys to string values");

// Spec: required fields.
const name = fields.name;
const description = fields.description;
if (typeof name !== "string" || !name) errors.push("frontmatter is missing `name`");
if (typeof description !== "string" || !description)
  errors.push("frontmatter is missing `description`");

// Spec: name constraints.
if (typeof name === "string" && name) {
  if (name.length > 64) errors.push(`\`name\` exceeds 64 characters (${name.length})`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name))
    errors.push(
      "`name` must be lowercase alphanumeric and hyphens, with no leading, trailing, or consecutive hyphens",
    );
  const dir = basename(root);
  if (dir !== name) {
    if (dir === `${name}-skill`) {
      warnings.push(
        `directory \`${dir}\` is a repo checkout name. The installed directory must be \`${name}\` to satisfy the spec's name-matches-directory rule`,
      );
    } else {
      errors.push(`\`name\` (${name}) does not match the containing directory (${dir})`);
    }
  }
}

// Spec: length caps.
if (typeof description === "string" && description.length > 1024)
  errors.push(`\`description\` exceeds 1024 characters (${description.length})`);
if (typeof fields.compatibility === "string" && fields.compatibility.length > 500)
  errors.push(`\`compatibility\` exceeds 500 characters (${fields.compatibility.length})`);

// Spec: no top-level keys outside the defined six.
for (const key of Object.keys(fields)) {
  if (!SPEC_KEYS.has(key)) errors.push(`unknown top-level frontmatter key \`${key}\``);
}

// Every support file referenced in the body must exist.
const body = raw.slice(fm[0].length);
const refPattern = /(?:references|scripts|assets)\/[\w./-]+\.\w+/g;
for (const ref of new Set(body.match(refPattern) ?? [])) {
  if (!existsSync(join(root, ref))) errors.push(`SKILL.md references missing file \`${ref}\``);
}

// House: support-file routing in prose must be a descriptive Markdown link.
// Literal paths inside fenced executable examples remain valid command text.
const proseBody = body.replace(/```[\s\S]*?```/g, "");
const linkedSupportFiles = new Set(
  [...proseBody.matchAll(/\[[^\]]+\]\(((?:references|scripts|assets)\/[\w./-]+\.\w+)(?:#[^)]+)?\)/g)]
    .map((match) => match[1]),
);
for (const ref of new Set(proseBody.match(refPattern) ?? [])) {
  if (!linkedSupportFiles.has(ref)) {
    errors.push(`prose support-file reference \`${ref}\` must be a descriptive Markdown link`);
  }
}

// Every support file should be reachable from SKILL.md, or documented in
// AGENTS.md when it is a maintenance tool rather than a use-time resource.
const agentsPath = join(root, "AGENTS.md");
const agentsBody = existsSync(agentsPath) ? readFileSync(agentsPath, "utf8") : "";
for (const dir of ["references", "scripts", "assets"]) {
  const dirPath = join(root, dir);
  if (!existsSync(dirPath)) continue;
  for (const entry of readdirSync(dirPath)) {
    const ref = `${dir}/${entry}`;
    if (!body.includes(ref) && !agentsBody.includes(ref))
      warnings.push(`\`${ref}\` is never referenced by SKILL.md or AGENTS.md`);
  }
}

// House: recommended size budget.
const lineCount = raw.split(/\r?\n/).length;
if (lineCount > 500) warnings.push(`SKILL.md is ${lineCount} lines (recommended under 500)`);

for (const w of warnings) console.log(`WARN: ${w}`);
for (const e of errors) console.error(`ERROR: ${e}`);
if (errors.length) {
  console.error(`\n${errors.length} error(s), ${warnings.length} warning(s) in ${root}`);
  process.exit(1);
}
console.log(`OK: ${basename(root)} passes (${warnings.length} warning(s))`);

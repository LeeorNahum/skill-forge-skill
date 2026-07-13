#!/usr/bin/env node
// Sync the vendored Agent Skills specification and authoring guides from their
// upstream source of truth.
//
// Resolves the latest commit on agentskills/agentskills main, fetches each
// mapped docs page pinned to that exact commit so the run is consistent and
// recordable, converts the MDX pages to plain markdown, and writes them into
// references/.
//
// Provenance stays in git history: the workflow records the upstream SHA in the
// sync commit message. Do not add a commit SHA inside the generated files, so a
// file only changes when its content changes.

import { writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OWNER = "agentskills";
const REPO = "agentskills";
const BRANCH = "main";

// Upstream docs page -> references/<name>.md
const FILES = {
  "docs/specification.mdx": "specification",
  "docs/skill-creation/best-practices.mdx": "best-practices",
  "docs/skill-creation/optimizing-descriptions.mdx": "optimizing-descriptions",
  "docs/skill-creation/using-scripts.mdx": "using-scripts",
  "docs/skill-creation/evaluating-skills.mdx": "evaluating-skills",
};

const REFS_DIR = fileURLToPath(new URL("../references/", import.meta.url));

async function fetchOk(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res;
}

const headers = { "user-agent": "skill-forge-sync" };
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

if (process.argv.includes("--help")) {
  console.log("Usage: node scripts/sync.mjs\nVendors the Agent Skills spec and guides into references/. No arguments.");
  process.exit(0);
}

const commit = await (
  await fetchOk(`https://api.github.com/repos/${OWNER}/${REPO}/commits/${BRANCH}`, { headers })
).json();
const sha = commit.sha;
if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`Unexpected upstream commit sha: ${sha}`);

mkdirSync(REFS_DIR, { recursive: true });

for (const [upstreamPath, localName] of Object.entries(FILES)) {
  const raw = await (
    await fetchOk(
      `https://raw.githubusercontent.com/${OWNER}/${REPO}/${sha}/${upstreamPath}`,
      { headers },
    )
  ).text();

  // Pull title and description out of the MDX frontmatter.
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!fm) throw new Error(`No frontmatter found in upstream ${upstreamPath}`);
  const field = (key) => {
    const m = fm[1].match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, "m"));
    return m ? m[1] : "";
  };
  const title = field("title") || localName;
  const description = field("description");

  // Body: strip frontmatter, drop MDX component wrapper tags (indented or not)
  // such as <Card> and <Tab> while keeping their inner markdown, and rewrite
  // site-root-relative links so they resolve locally or to the live site.
  const body = raw
    .slice(fm[0].length)
    .replace(/^\s*<\/?[A-Z][a-zA-Z]*[^>]*>\s*$/gm, "")
    .replace(/\]\(\/skill-creation\/([a-z-]+)(#[^)]*)?\)/g, "]($1.md$2)")
    .replace(/\]\(\/specification(#[^)]*)?\)/g, "](specification.md$1)")
    .replace(/\]\(\/([a-z][\w/-]*)(#[^)]*)?\)/g, "](https://agentskills.io/$1$2)")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const out = [
    "<!-- GENERATED FILE, do not edit. Vendored by scripts/sync.mjs from " +
      `${OWNER}/${REPO} ${upstreamPath}. -->`,
    "",
    `# ${title}`,
    "",
    ...(description ? [`> ${description}`, ""] : []),
    `_Source: <https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${upstreamPath}>_`,
    "",
    body,
    "",
  ].join("\n");

  writeFileSync(`${REFS_DIR}${localName}.md`, out);
  console.log(`Wrote references/${localName}.md`);
}

console.log(`Synced from ${OWNER}/${REPO}@${sha.slice(0, 7)}`);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `upstream_sha=${sha}\n`);
}

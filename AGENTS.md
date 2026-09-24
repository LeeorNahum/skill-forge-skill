# AGENTS.md

Rules for editing the **skill-forge** skill. User-facing guidance lives in `SKILL.md`. `README.md` is the human skim layer.

## File roles

| File | Edited by | Role |
| --- | --- | --- |
| `SKILL.md` | Hand | Authoring philosophy, frontmatter contract, description rules, structure, validation |
| `references/*.md` | Generated | Vendored Agent Skills specification and authoring guides, written by the sync script |
| `scripts/sync.mjs` | Hand | Vendors the spec and guides from `agentskills/agentskills`, pinned to one upstream commit |
| `scripts/validate.mjs` | Hand | Zero-dependency spec validator run against skills being forged |
| `package.json` | Hand | Exposes this Node.js validator through a repository-backed package runner and keeps its version aligned |
| `.github/workflows/sync-upstream.yml` | Hand | Weekly and on-demand sync, commits only on change |
| `.gitattributes` | Hand | Forces LF line endings so Windows-local and Linux-CI runs never disagree |
| `README.md` | Hand | Short human summary |

One owner per concern. Never hand-edit a generated file. Change `scripts/sync.mjs` and re-run it.

## Editing

- Bump `metadata.version` by the rules of the release-versioning skill that `SKILL.md` links to.
- Quote every frontmatter string value. Keys stay unquoted.
- No em dashes, and no semicolons used to join what should be separate sentences. Use commas, periods, parentheses, or "to".
- Capitalized bullets and parallel list voice.
- Positive rules. Describe the category of mistake instead of preserving bad examples.
- Placeholders only. This meta skill must not name real projects, repos, or people beyond its own metadata, its public execution route, and its link to the release-versioning skill, which owns version rules.
- A rule the validator can check is checked there. A rule with no emitter is advisory and gets skipped, so a house rule a script can enforce lands in `scripts/validate.mjs` in the same change.
- The Meaning Preservation section of `SKILL.md` applies to editing this skill too: preserve distinctive, high-signal wording.

## Validator notes

- `scripts/validate.mjs` softens one spec rule: a `<name>-skill` repo checkout directory warns instead of failing, since the spec's name-matches-directory rule binds the installed path.
- Its U+2014 check skips code fences, inline code spans, and files whose first line is an HTML comment naming them generated, so a skill can show the character as technical content and vendored references stay verbatim.
- The official `skills-ref` reference validator enforces the frontmatter contract: required `name` and `description`, the length caps, the `name` charset and parent-directory match, and rejection of any top-level key outside the six the specification defines. Every finding is an error and a failing run exits non-zero. It ships inside the specification repository as a reference implementation rather than a published package. The sibling commands `skills-ref read-properties` and `skills-ref to-prompt` inspect metadata and preview a catalog entry. It does not replace trigger, workflow, or output evaluation.

## Sync provenance

- Every file in `references/` is generated from an `agentskills/agentskills` docs page by `scripts/sync.mjs`. The `FILES` map in the script is the page-to-file mapping.
- The workflow records the exact upstream commit in each sync commit message. Do not add a commit SHA inside the generated files. Provenance stays in git history so a file changes only when its content changes.
- Upstream em dashes and styling stay verbatim in generated files. House style applies only to hand-edited files.
- If upstream renames, splits, or restructures a docs page, update the `FILES` map or transforms in `scripts/sync.mjs` and re-run. When SKILL.md's distillation and an upstream guide disagree, SKILL.md wins for house opinion and the spec wins for the format contract.

## Before finishing

- `references/` matches a fresh run of `node scripts/sync.mjs`.
- Every reference has a routing line in SKILL.md's Reference Loading section.
- Every support file named by `SKILL.md` exists and has a direct loading condition.
- `package.json` matches the skill version and exposes the validator with every file it needs at runtime.
- Bullets stay capitalized, with no em dashes and no joiner semicolons introduced.
- `metadata.version` bumped as the release-versioning skill requires.
- `README.md` matches the actual file layout.

# AGENTS.md

Rules for editing the **skill-forge** skill. User-facing guidance lives in `SKILL.md`. `README.md` is the human skim layer.

## File roles

| File | Edited by | Role |
| --- | --- | --- |
| `SKILL.md` | Hand | Authoring philosophy, frontmatter contract, description rules, structure, validation |
| `references/*.md` | Generated | Vendored Agent Skills specification and authoring guides, written by the sync script |
| `scripts/sync.mjs` | Hand | Vendors the spec and guides from `agentskills/agentskills`, pinned to one upstream commit |
| `scripts/validate.mjs` | Hand | Zero-dependency spec validator run against skills being forged |
| `.github/workflows/sync-upstream.yml` | Hand | Weekly and on-demand sync, commits only on change |
| `.gitattributes` | Hand | Forces LF line endings so Windows-local and Linux-CI runs never disagree |
| `README.md` | Hand | Short human summary |

One owner per concern. Never hand-edit a generated file. Change `scripts/sync.mjs` and re-run it.

## Editing

- Bump `metadata.version` with semver in the same change whenever authored behavior changes. Calibrate one honest bump per checkpoint, as `SKILL.md` itself teaches.
- Quote every frontmatter string value. Keys stay unquoted.
- No em dashes, and no semicolons used to join what should be separate sentences. Use commas, periods, parentheses, or "to".
- Capitalized bullets and parallel list voice.
- Positive rules. Describe the category of mistake instead of preserving bad examples.
- Placeholders only. This meta skill must not name real projects, repos, or people beyond its own metadata.
- The Meaning Preservation section of `SKILL.md` applies to editing this skill too: preserve distinctive, high-signal wording.

## Sync provenance

- Every file in `references/` is generated from an `agentskills/agentskills` docs page by `scripts/sync.mjs`. The `FILES` map in the script is the page-to-file mapping.
- The workflow records the exact upstream commit in each sync commit message. Do not add a commit SHA inside the generated files. Provenance stays in git history so a file changes only when its content changes.
- A sync-only content refresh never bumps `metadata.version`.
- Upstream em dashes and styling stay verbatim in generated files. House style applies only to hand-edited files.
- If upstream renames, splits, or restructures a docs page, update the `FILES` map or transforms in `scripts/sync.mjs` and re-run. When SKILL.md's distillation and an upstream guide disagree, SKILL.md wins for house opinion and the spec wins for the format contract.

## Before finishing

- `references/` matches a fresh run of `node scripts/sync.mjs`.
- Every reference has a routing line in SKILL.md's Reference Loading section.
- Every support file named by `SKILL.md` exists and has a direct loading condition.
- Bullets stay capitalized, with no em dashes and no joiner semicolons introduced.
- `metadata.version` bumped if and only if authored behavior changed.
- `README.md` matches the actual file layout.

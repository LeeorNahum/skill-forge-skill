---
name: "skill-forge"
description: "Create, design, refine, and validate Agent Skills that follow the open SKILL.md standard. Use when the user wants to create or author a new Agent Skill, improve an Agent Skill's triggering description, organize an Agent Skill's references, scripts, or assets directories, preserve key wording and meaning during Agent Skill edits, decide an Agent Skill's automatic-versus-manual invocation style, or asks about Agent Skill structure, naming conventions, or SKILL.md format."
metadata:
  author: "Leeor Nahum"
  version: "2.2.1"
---

# Skill Forge

Create skills that are concise, precisely scoped, and free of context bloat. A skill transfers knowledge the agent lacks, not knowledge it already has.

The upstream source of truth is [agentskills.io](https://agentskills.io/specification). The specification and its authoring guides are vendored under `references/`. This file is the opinionated distillation. The references are the upstream originals, and `AGENTS.md` owns how they are kept current.

## Reference Loading

- Read `references/specification.md` before creating a skill from scratch, and whenever unsure about an exact frontmatter constraint, the directory contract, or what the standard requires versus what is host-specific or house convention. It is the normative spec. Follow it exactly.
- Read `references/optimizing-descriptions.md` when a skill misfires or fails to trigger and the description needs systematic tuning, or when running a trigger evaluation.
- Read `references/using-scripts.md` when adding or reviewing a `scripts/` directory.
- Read `references/evaluating-skills.md` when building evals for a skill or measuring with-skill versus without-skill performance.
- Read `references/best-practices.md` when structuring a complex multi-file skill and this file's rules leave a judgment call open.

## What Each Part Is For

Agents routinely blur these boundaries. Check every skill edit against this table:

| Part | Job | Consumed |
| --- | --- | --- |
| `name` + `description` | Selection only. They decide whether the skill loads and are never the rules | Read at startup for every skill |
| `SKILL.md` body | The always-needed rules and routing | Loaded when the skill triggers |
| `references/` | Conditional rules and guidance | Loaded when a routing condition matches |
| `assets/` | Copyable artifacts | Copied or filled in, not read as guidance |
| `scripts/` | Executable helpers | Run, not read as guidance |
| `AGENTS.md` | Maintenance contract for editing the skill | Read when editing the skill, never at use time |
| `README.md` | Human skim layer | Read by humans, not loaded by agents |

An instruction that lives only in the description is invisible at execution time, because the description's job ends once the skill loads. Put rules in the body or a reference. In the other direction, procedural detail in the description wastes the selection budget and blurs the trigger.

## Frontmatter

```yaml
---
name: "<domain>"
description: "<what the skill does and when to use it>"
license: "<license name or bundled license file>"
compatibility: "<specific environment requirements, when needed>"
allowed-tools: "<space-separated pre-approved tools, when supported>"
metadata:
  author: "<your name>"
  version: "1.0.0"
---
```

Only `name` and `description` are required. Omit optional fields that do not apply.

Quote every frontmatter string value, including simple identifiers, descriptions, licenses, compatibility text, tool lists, and metadata values. YAML keys remain unquoted. Consistent quoting prevents punctuation such as colons, hashes, braces, brackets, commas, and leading special characters from changing how YAML parses a value.

Frontmatter contract:

- `name`: Required. Use 1-64 lowercase ASCII letters, numbers, and hyphens. Match the parent directory and use no leading, trailing, or consecutive hyphens.
- `description`: Required. Use 1-1024 characters to state what the skill does and when to use it.
- `license`: Optional. Use a short license name or a reference to a bundled license file.
- `compatibility`: Optional. Use 1-500 characters only for real environment requirements such as intended products, system packages, or network access.
- `metadata`: Optional. Use a mapping of string keys to string values. Prefer reasonably unique keys.
- `allowed-tools`: Optional and experimental. Use a space-separated string of pre-approved tools only when the target client supports it.

These six keys are the complete set the specification defines. The reference validator rejects any other top-level key, so a host-specific field makes the skill fail strict validation. Do not add one. Custom properties belong under `metadata`.

Version rules:

- Patch: wording fixes, examples, small clarifications
- Minor: new guidance, wider supported scenarios, better structure
- Major: changed behavior, changed scope, renamed skill, or major rewrite

When editing an existing skill, update `metadata.version` using [Semantic Versioning (semver)](https://semver.org/) in the same change whenever the skill's behavior changes. Never leave a substantive accepted skill edit at the old version. Make sure any README or release notes referencing current behavior are updated to match.

Do not bump the version for every message, pass, or partial edit. During initial creation, active drafting, fast review loops, or uncommitted edits the same agent owns, keep the draft's version stable until the work is ready to be treated as the next version. Then make one semver bump that describes the finished change since the last committed, published, or otherwise accepted checkpoint.

Before incrementing, check git for the last committed version of the skill file. If uncommitted changes have accumulated across multiple passes since that checkpoint, calibrate one bump to reflect the full delta honestly. A sequence of related additions since the last commit may warrant a single well-chosen minor bump rather than separate micro-increments per pass. If git history is unavailable, use the nearest meaningful checkpoint: the last user-approved draft, install, release, or handoff.

## Description Rules

The description is the trigger. It should describe both:

1. What the skill does
2. When the agent should use it

Write for user intent, not internal implementation. Implementation steps, internal behaviors, and procedural detail belong in the body. The description covers only the high-level job and when to invoke. Be specific about domain, surface, and signal. Vague descriptions trigger on the wrong prompts or not at all. Keep it specific, high-signal, and under the spec limit. Prefer imperative phrasing that tells the agent when to use the skill. Err on the side of being pushy: list the situations that should trigger the skill even when the user would not name the domain themselves.

The description is read in isolation to decide whether to load the skill, so every clause must earn its place in that decision. Do not spend it defining the artifact or using insider terms the agent will not recognize at selection time. Describe what the skill does and the situations that should trigger it, in words a deciding agent already understands.

```text
Too vague:
Helps with data tasks.

Better:
Parse, validate, and export structured data to external formats. Use when reading CSV or JSON input, transforming records, or writing output files for downstream consumption.
```

## Content Philosophy

Add what the agent lacks and omit what it already knows. Before including any content, ask: "Would the agent get this wrong without being told?" If no, cut it.

Ground the skill in demonstrated expertise: real runs, corrections that were actually needed, project artifacts, and observed failure cases, not generic model knowledge. When possible, refine by running the skill against a real task, reading the execution trace, and feeding what broke back into the skill.

Context bloat is not only verbosity. It is also nearby information that does not belong to the skill's true scope but slips in because it was present in the conversation.

Generic best practices, standard library usage, and common patterns the agent already knows are also context bloat.

Judge an addition against the whole skill, not the amount of attention it received in the current request. Give it only the prominence its lasting importance warrants. Prefer the smallest edit in the existing section or reference over new sections, repeated summaries, or broad rewrites.

Prefer procedures, gotchas, checklists, validation loops, and output templates over generic advice.

Keep list voice consistent within a skill: parallel phrasing and one capitalization style across a list. Prefer starting bullets with a capital letter. Inconsistent list style reads as drift.

No code unless the code is the artifact. Include explicit code only when enforcing a pattern that must be followed exactly, where the code template is itself the deliverable rather than an illustration.

No "When to Use" section. The description handles triggering. Repeating it in the body wastes tokens.

## Meaning Preservation

When editing or improving a skill:

- Preserve working text outside the required change. Rewrite adjacent material only when the new requirement makes it inaccurate, misplaced, or meaningfully weaker.
- Preserve distinctive, high-signal wording that carries the author's intent
- Do not flatten specialized language into generic process language
- Do not delete a concept just because you can paraphrase around it
- If you move an idea, make sure the wording or equivalent force still exists somewhere intentional
- If a phrase seems minor but anchors the whole skill's mentality, keep it
- If a phrase carries real meaning, compression, taste, or domain signal, preserve it unless you are clearly improving it and deliberately relocating that meaning elsewhere
- Do not replace high-signal language with flatter but more generic wording

## Boundary Discipline

Skill Forge is for skills only.

Do not import adjacent standards, nearby examples, or recent conversation artifacts into the core skill unless they are part of the skill's enduring scope.

If some information is useful but secondary, place it in a reference file and tell the agent when to read it. Do not let it leak into the opening thesis or core philosophy.

Avoid negative anchors in generic skills. Do not preserve bad examples, deprecated folder names, real project names, local paths, or personal names just to say not to use them. Describe the category of mistake instead.

Positive examples anchor too. A sample name or token offered to illustrate a point is often copied verbatim instead of adapted. Use an example to show a shape or structure, and make clear the reader should choose the most accurate name for their own case rather than reusing the example's wording.

When writing a reusable or meta skill, use placeholders unless a real proper noun is part of the skill's durable scope.

## Progressive Disclosure

Keep `SKILL.md` focused and move conditional detail into `references/`, `scripts/`, or `assets/`.

Tell the agent exactly when to read or use every support file. A loose pointer to a directory is not enough.

Keep `SKILL.md` under 500 lines and, where practical, under the specification's recommended 5,000-token budget. Reference every support file by its relative path from the skill root, such as `references/<file>.md` or `scripts/<file>`. Keep references one level deep from `SKILL.md`, and let the main file route directly to every conditional resource. Avoid chains where one reference points to another.

Create a support file only when its material is conditional enough that most uses should not load it. Keep information in `SKILL.md` when every invocation needs it.

## Assets, References, And Scripts

Use support files only when they have a clear job:

- `references/`: explanatory guidance, decision rules, gotchas, examples, and material the agent reads before deciding what to do
- `assets/`: copyable templates, configs, static resources, or fill-in artifacts that may become files in another project
- `scripts/`: executable helpers the agent can run

If markdown is meant to be read as guidance, put it in `references/`. If markdown is meant to be copied as a starter file, put it in `assets/` and make the fill-in or trim points obvious.

An asset may contain editable placeholders. It does not need to be immutable, but it should be copyable as an artifact. If the file mainly explains judgment, tradeoffs, or rules, it is a reference, not an asset.

Prefer pointing to an asset over embedding the artifact's content inline in `SKILL.md` or a reference. An inlined artifact bloats every load and drifts from the copyable original.

Do not create extra files speculatively. If `SKILL.md` does not tell the agent when to load or use a reference, asset, or script, that file is probably bloat.

## Vendored Upstream Sources

When a skill wraps a living external source of truth, such as a specification, official vendor guidance, or generated documentation, vendor that material into `references/` instead of telling the agent to fetch it at use time. Vendoring keeps the skill self-contained, offline-safe, and identical across agents, while a sync job keeps it current.

The working pattern:

- A zero-dependency script in `scripts/` resolves the upstream's latest commit, fetches every file pinned to that exact commit, applies any transforms, and writes the generated files into `references/`
- Each generated file starts with a generated-file banner and a source link, but no upstream commit hash, so the file only changes when its content changes
- A scheduled workflow runs the script and commits only when something changed, recording the upstream commit in the sync commit message. Provenance lives in git history, not in the tracked files
- When the script rewrites upstream advice the skill disagrees with, add a workflow guard that fails if an un-rewritten instance slips through
- Never hand-edit a generated file. Change the script or the upstream and re-run the sync
- A sync-only content refresh does not bump `metadata.version`. The version tracks authored behavior

Document the upstream sources, transform rules, and update playbook in the skill's `AGENTS.md`.

## Content Patterns

Use these when they fit. Not all skills need all of them.

| Pattern | Use when |
| --- | --- |
| **Table** | Same concept diverges by environment or surface |
| **Gotchas** | Non-obvious constraints the agent will confidently get wrong |
| **Checklist** | Multi-step workflow where skipping steps causes failures |
| **Output template** | The agent must produce output in a specific, non-negotiable format |
| **Reference files** | Detail that's only needed conditionally and loaded on demand from `SKILL.md` |

## Directory Structure

```text
<skill-name>/
├── SKILL.md              # core, keep focused, under ~500 lines
├── AGENTS.md             # recommended, maintenance contract for editing the skill
├── references/           # documentation loaded on demand
├── scripts/              # executable code the agent runs
├── assets/               # templates, configs, static resources
├── README.md             # recommended, human-facing skim layer
└── LICENSE               # optional, useful for public repos
```

The local `<skill-name>` directory must exactly match the frontmatter `name`. Remote repository naming is outside the Agent Skills specification and outside this skill's guidance.

Ship `AGENTS.md` and `README.md` by default for any skill meant to last: `AGENTS.md` as the maintenance contract, `README.md` as the human skim layer. They are recommended, not optional scaffolding. Omit them only for a throwaway or trivial skill. Only create the `references/`, `scripts/`, and `assets/` directories the skill actually uses.

Put conditional material in `references/` instead of leaving extra markdown files loose at the root.

If a repo includes `README.md`, treat it as human-facing. It should be extremely concise, fast to skim, and focused on the minimum needed to understand the skill's value and file layout. Do not turn the README into a second `SKILL.md`.

If a skill carries an `AGENTS.md`, treat it as the skill's maintenance contract: file roles, editing rules, wording conventions, sync provenance, and finishing checks for whoever edits the skill. Its job is continuity: many sessions of agent edits accumulate on a lasting skill, and the contract keeps style, voice, and scope from drifting across them. Keep that maintainer guidance out of `SKILL.md`, which stays purely user-facing usage. A note such as how a vendored reference is regenerated belongs in `AGENTS.md`, not in the skill body.

## Invocation Style

The description is the primary mechanism for controlling when a skill loads. If it is precise enough, auto-invocation works correctly and that is the right outcome. Invocation problems are almost always description problems: tighten the trigger wording before reaching for any other mechanism.

Decide whether the skill should be:

- Auto-invoked for narrow, precise, task-specific workflows
- Manual-only for skills that are typed commands with no natural-language trigger the description could match
- Case-by-case when the skill sits between methodology and procedure

If unsure, default to automatic. A well-scoped description avoids false positives without any additional mechanism.

Set manual-only behavior in the description itself, never with a frontmatter flag, which would be a non-spec key the Frontmatter contract forbids. A skill that should only run when the user names it says so plainly in its description. Reserve manual-only for skills where there is genuinely no user intent the description could match: the skill is a bare typed command, not a task. Do not go manual-only because of false-positive risk or timing concerns. Those are description problems. A manual-only skill still needs a description that states what it does and when, since the user reads it when choosing to invoke.

## Avoid Canonical Leaks

Meta skills, skills about process, format, or methodology rather than a specific project, must not reference real names, repos, or artifacts from the context in which they were written. Examples should use invented, obviously-placeholder names. A leaked canonical reference creates an unintended dependency and anchors the skill to something that may change or not exist in another user's context.

This skill's own frontmatter is not a template. Do not copy its concrete values into new skills. Use the placeholders in the Frontmatter section above.

Project-specific skills are the exception: when a skill is explicitly scoped to a known repo, library, or codebase, proper nouns and real references are appropriate and desirable.

## Scope

A skill should encapsulate one coherent unit of work, narrow enough to trigger precisely and broad enough that it does not need a sibling skill loaded alongside it to do its job.

If a skill requires another skill to function, either merge them or reconsider the split.

## Validation

Before finishing:

- Run `node scripts/validate.mjs <skill-root>` from this skill's root. The bundled zero-dependency validator enforces the spec frontmatter contract, checks that every support file path named in the target `SKILL.md` exists, and flags unreferenced support files. One documented softening: a `<name>-skill` repo checkout directory warns instead of failing, since the spec's name-matches-directory rule binds the installed path. Also run `skills-ref validate <skill-root>` when the official reference validator is available.
- Confirm every support file named by `SKILL.md` has a direct loading condition.
- Keep `SKILL.md` within the recommended line and token budgets.
- Test the description against realistic should-trigger and near-miss should-not-trigger prompts, roughly ten of each, and tune until both sets pass.
- Test realistic skill tasks and compare the output with a baseline or the previous version.
- For scripts, document prerequisites, avoid interactive prompts, expose useful help, return actionable errors, and use structured output when another step consumes the result.

The reference validator enforces the frontmatter contract: required `name` and `description`, the length caps, the `name` charset and parent-directory match, and rejection of any top-level key outside the six the specification defines. Every finding is an error and a failing run exits non-zero. It ships inside the specification repository as a reference implementation rather than a published package. The sibling commands `skills-ref read-properties` and `skills-ref to-prompt` inspect metadata and preview a catalog entry. It does not replace trigger, workflow, or output evaluation.

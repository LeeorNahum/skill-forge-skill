---
name: "skill-forge"
description: "Create, design, refine, and package Agent Skills that follow the open SKILL.md standard. Use when the user wants to create or author a new skill, improve skill triggering, organize references/scripts/assets, preserve key wording and meaning during edits, decide invocation style, or asks about skill structure, naming conventions, or SKILL.md format."
metadata:
  author: "Leeor Nahum"
  version: "2.1.0"
---

# Skill Forge

Create skills that are concise, precisely scoped, and free of context bloat. A skill transfers knowledge the agent lacks, not knowledge it already has.

The specification source of truth is [agentskills.io](https://agentskills.io/specification).

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

Version rules:

- Patch: wording fixes, examples, small clarifications
- Minor: new guidance, wider supported scenarios, better structure
- Major: changed behavior, changed scope, renamed skill, or major rewrite

When editing an existing skill, update `metadata.version` using [Semantic Versioning (semver)](https://semver.org/) in the same change whenever the skill's behavior changes. Never leave a substantive skill edit at the old version. Make sure any README or release notes referencing current behavior are updated to match.

Increment immediately when changes are made. Do not wait for a commit, push, or user signal to bump the version. If the version is not updated before the user commits on their own, the changes ship with a stale version.

Before incrementing, check git for the last committed version of the skill file. If uncommitted changes have accumulated across multiple passes since that checkpoint, calibrate the bump to reflect the full delta honestly. A sequence of minor additions since the last commit may warrant a single well-chosen minor bump rather than separate micro-increments per pass. If git history is unavailable, increment based on the current change as normal. The version must be truthful about the scope of all changes since the last committed state.

## Description Rules

The description is the trigger. It should describe both:

1. What the skill does
2. When the agent should use it

Write for user intent, not internal implementation. Be specific about domain, surface, and signal. Vague descriptions trigger on the wrong prompts or not at all. Keep it specific, high-signal, and under the spec limit. Prefer imperative phrasing that tells the agent when to use the skill.

The description is read in isolation to decide whether to load the skill, so every clause must earn its place in that decision. Do not spend it defining the artifact or using insider terms the agent will not recognize at selection time. Describe what the skill does and the situations that should trigger it, in words a deciding agent already understands.

```text
Too vague:
Helps with data tasks.

Better:
Parse, validate, and export structured data to external formats. Use when reading CSV or JSON input, transforming records, or writing output files for downstream consumption.
```

## Content Philosophy

Add what the agent lacks and omit what it already knows. Before including any content, ask: "Would the agent get this wrong without being told?" If no, cut it.

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

Keep `SKILL.md` under 500 lines and, where practical, under the specification's recommended 5,000-token budget. Keep references one level deep from `SKILL.md`; let the main file route directly to every conditional resource.

Create a support file only when its material is conditional enough that most uses should not load it. Keep information in `SKILL.md` when every invocation needs it.

## Assets, References, And Scripts

Use support files only when they have a clear job:

- `references/`: explanatory guidance, decision rules, gotchas, examples, and material the agent reads before deciding what to do
- `assets/`: copyable templates, configs, static resources, or fill-in artifacts that may become files in another project
- `scripts/`: executable helpers the agent can run

If markdown is meant to be read as guidance, put it in `references/`. If markdown is meant to be copied as a starter file, put it in `assets/` and make the fill-in or trim points obvious.

An asset may contain editable placeholders. It does not need to be immutable, but it should be copyable as an artifact. If the file mainly explains judgment, tradeoffs, or rules, it is a reference, not an asset.

Do not create extra files speculatively. If `SKILL.md` does not tell the agent when to load or use a reference, asset, or script, that file is probably bloat.

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

Ship `AGENTS.md` and `README.md` by default for any skill meant to last: `AGENTS.md` as the maintenance contract, `README.md` as the human skim layer. They are recommended, not optional scaffolding; omit them only for a throwaway or trivial skill. Only create the `references/`, `scripts/`, and `assets/` directories the skill actually uses.

Put conditional material in `references/` instead of leaving extra markdown files loose at the root.

If a repo includes `README.md`, treat it as human-facing. It should be extremely concise, fast to skim, and focused on the minimum needed to understand the skill's value and file layout. Do not turn the README into a second `SKILL.md`.

If a skill carries an `AGENTS.md`, treat it as the skill's maintenance contract: file roles, editing rules, wording conventions, sync provenance, and finishing checks for whoever edits the skill. Keep that maintainer guidance out of `SKILL.md`, which stays purely user-facing usage. A note such as how a vendored reference is regenerated belongs in `AGENTS.md`, not in the skill body.

## Invocation Style

The description is the primary mechanism for controlling when a skill loads. If it is precise enough, auto-invocation works correctly and that is the right outcome. Invocation problems are almost always description problems: tighten the trigger wording before reaching for any other mechanism.

Decide whether the skill should be:

- Auto-invoked for narrow, precise, task-specific workflows
- Manual-only for skills that are typed commands with no natural-language trigger the description could match
- Case-by-case when the skill sits between methodology and procedure

If unsure, default to automatic. A well-scoped description avoids false positives without any additional mechanism.

Set manual-only invocation with the host's mechanism, not wording alone. In hosts that support it, `disable-model-invocation: true` in the frontmatter marks a skill manual-only. Reserve this for skills where there is genuinely no user intent the description could match: the skill is a bare typed command, not a task. Do not use it because of false-positive risk or timing concerns. Those are description problems. A manual-only skill still needs a description that states what it does and when, since the user reads it when choosing to invoke.

## Avoid Canonical Leaks

Meta skills, skills about process, format, or methodology rather than a specific project, must not reference real names, repos, or artifacts from the context in which they were written. Examples should use invented, obviously-placeholder names. A leaked canonical reference creates an unintended dependency and anchors the skill to something that may change or not exist in another user's context.

This skill's own frontmatter is not a template. Do not copy its concrete values into new skills. Use the placeholders in the Frontmatter section above.

Project-specific skills are the exception: when a skill is explicitly scoped to a known repo, library, or codebase, proper nouns and real references are appropriate and desirable.

## Scope

A skill should encapsulate one coherent unit of work, narrow enough to trigger precisely and broad enough that it does not need a sibling skill loaded alongside it to do its job.

If a skill requires another skill to function, either merge them or reconsider the split.

## Validation

Before finishing:

- Run `skills-ref validate <skill-root>` when the official reference validator is available.
- Confirm every support file named by `SKILL.md` exists and has a direct loading condition.
- Keep `SKILL.md` within the recommended line and token budgets.
- Test the description against realistic should-trigger and near-miss should-not-trigger prompts.
- Test realistic skill tasks and compare the output with a baseline or the previous version.
- For scripts, document prerequisites, avoid interactive prompts, expose useful help, return actionable errors, and use structured output when another step consumes the result.

The reference validator checks frontmatter and naming conventions. It does not replace trigger, workflow, or output evaluation.

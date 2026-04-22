---
name: skill-forge
description: Create, design, refine, and package Agent Skills that follow the open SKILL.md standard. Use when the user wants to create or author a new skill, improve skill triggering, organize references/scripts/assets, preserve key wording and meaning during edits, decide invocation style, or asks about skill structure, naming conventions, or SKILL.md format.
metadata:
  author: Leeor Nahum
  version: "1.1.0"
---

# Skill Forge

Create skills that are concise, precisely scoped, and free of context bloat. A skill transfers knowledge the agent lacks, not knowledge it already has.

The spec source of truth is [skill.md](http://skill.md/).

For the official constraints, expected directories, and host-specific loading notes, read `references/standards.md` when you need them.

## Naming Convention

- **Skill root folder** and **`name` field**: `<domain>` (example: `data-export`)
- **Repo name** may match the skill name directly or may use a `-skill` suffix for personal organization
- The repo naming choice is organizational rather than semantic; do not treat it as part of the skill contract

## Frontmatter

```yaml
---
name: <domain>
description: <what the skill does and when to use it>
metadata:
  author: <your name>
  version: "1.1.0"
---
```

Version rules:

- patch: wording fixes, examples, small clarifications
- minor: new guidance, wider supported scenarios, better structure
- major: changed behavior, changed scope, renamed skill, or major rewrite

## Description Rules

The description is the trigger. It should describe both:

1. what the skill does
2. when the agent should use it

Write for user intent, not internal implementation. Be specific about domain, surface, and signal. Vague descriptions trigger on the wrong prompts or not at all. Keep it specific, high-signal, and under the spec limit.

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

Prefer procedures, gotchas, checklists, validation loops, and output templates over generic advice.

No code unless the code is the artifact. Include explicit code only when enforcing a pattern that must be followed exactly, where the code template is itself the deliverable rather than an illustration.

No "When to Use" section. The description handles triggering. Repeating it in the body wastes tokens.

## Meaning Preservation

When editing or improving a skill:

- preserve distinctive, high-signal wording that carries the author's intent
- do not flatten specialized language into generic process language
- do not delete a concept just because you can paraphrase around it
- if you move an idea, make sure the wording or equivalent force still exists somewhere intentional
- if a phrase seems minor but anchors the whole skill's mentality, keep it
- if a phrase carries real meaning, compression, taste, or domain signal, preserve it unless you are clearly improving it and deliberately relocating that meaning elsewhere
- do not replace high-signal language with flatter but more generic wording

## Boundary Discipline

Skill Forge is for skills only.

Do not import adjacent standards, nearby examples, or recent conversation artifacts into the core skill unless they are part of the skill's enduring scope.

If some information is useful but secondary, place it in a reference file and tell the agent when to read it. Do not let it leak into the opening thesis or core philosophy.

## Progressive Disclosure

Keep `SKILL.md` focused and move conditional detail into `references/`, `scripts/`, or `assets/`.

Do not only say "see references." Tell the agent exactly when to read them.

Good:

- Read `references/standards.md` when checking official frontmatter rules, directory expectations, or host-specific loading behavior.
- Read `references/publishing.md` when preparing a public skill repo, choosing a distribution method, or setting semver policy.

Weak:

- See `references/` for more information.

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
<skill-root>/
├── SKILL.md              # core, keep focused, under ~500 lines
├── references/           # documentation loaded on demand
├── scripts/              # executable code the agent runs
├── assets/               # templates, configs, static resources
├── README.md             # optional, human-facing skim layer
└── LICENSE               # optional, useful for public repos
```

Only create directories that the skill actually uses.

Put conditional material in `references/` instead of leaving extra markdown files loose at the root.

If a repo includes `README.md`, treat it as human-facing. It should be extremely concise, fast to skim, and focused on the minimum needed to understand the skill's value and file layout. Do not turn the README into a second `SKILL.md`.

## Repository And Publishing

Read `references/publishing.md` when:

- deciding the repo layout for a public skill
- comparing distribution methods such as direct installs, GitHub-based installs, release artifacts, or submodules
- writing install instructions
- preparing tags, releases, or version bumps

## Invocation Style

Decide whether the skill should be:

- auto-invoked for narrow, precise, task-specific workflows
- manual-only for broad ambient guidance that would false-trigger too often
- case-by-case when the skill sits between methodology and procedure

If unsure, default to automatic only when the description can be precise enough to avoid frequent false positives.

## Avoid Canonical Leaks

Meta skills, skills about process, format, or methodology rather than a specific project, must not reference real names, repos, or artifacts from the context in which they were written. Examples should use invented, obviously-placeholder names. A leaked canonical reference creates an unintended dependency and anchors the skill to something that may change or not exist in another user's context.

This skill's own frontmatter is not a template. Do not copy its concrete values into new skills. Use the placeholders in the Frontmatter section above.

Project-specific skills are the exception: when a skill is explicitly scoped to a known repo, library, or codebase, proper nouns and real references are appropriate and desirable.

## Scope

A skill should encapsulate one coherent unit of work, narrow enough to trigger precisely and broad enough that it does not need a sibling skill loaded alongside it to do its job.

If a skill requires another skill to function, either merge them or reconsider the split.

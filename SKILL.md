---
name: skill-forge
description: Create a new Agent Skill in the established format. Use when the user wants to create, write, or author a new skill, or asks about skill structure, naming conventions, or SKILL.md format.
metadata:
  author: Leeor Nahum
  version: "1.0"
---

# Skill Forge

Create skills that are concise, precisely scoped, and free of context bloat. A skill transfers knowledge the agent lacks — not knowledge it already has.

The spec source of truth is [agentskills.io](https://agentskills.io).

## Naming Convention

- **Repo**: `<domain>-skill` (e.g. `data-export-skill`)
- **Folder** and **`name` field**: `<domain>` — must match exactly (e.g. `data-export`)
- The `-skill` suffix marks the repo as a skill; the folder and `name` field drop it

## Frontmatter

```yaml
---
name: <domain>              # matches folder name
description: <trigger>      # see Description below
metadata:
  author: <your name>
  version: "1.0"
---
```

**Version rules**: increment minor (`1.x`) for content refinements; bump major (`2.0`) for structural rewrites or significant scope changes.

## Description

The description is the triggering mechanism — agents decide relevance from it. It must answer two things: what the skill does, and precisely when to use it. Be specific about domain, surface, and signal. Vague descriptions trigger on the wrong prompts or not at all.

```
# Too vague
Helps with data tasks.

# Good
Parse, validate, and export structured data to external formats.
Use when reading CSV or JSON input, transforming records, or writing
output files for downstream consumption.
```

## Content Philosophy

**Add what the agent lacks — omit what it knows.** Before including any content, ask: *"Would the agent get this wrong without being told?"* If no, cut it. Generic best practices, standard library usage, and common patterns the agent already knows are context bloat.

**No code unless the code is the artifact.** Include explicit code only when enforcing an architectural pattern that must be followed exactly — where the code template *is* the deliverable, not an illustration of a concept. Otherwise code is noise.

**No "When to Use" section.** The description handles triggering. Repeating it in the body wastes tokens.

## Content Patterns

Use these when they fit — not all skills need all of them.

| Pattern | Use when |
| --- | --- |
| **Table** | Same concept diverges by environment or surface |
| **Gotchas** | Non-obvious constraints the agent will confidently get wrong |
| **Checklist** | Multi-step workflow where skipping steps causes failures |
| **Output template** | The agent must produce output in a specific, non-negotiable format |
| **Reference files** | Detail that's only needed conditionally — link from `SKILL.md`, load on demand |

## Directory Structure

```
<domain>-skill/
├── SKILL.md              # core — keep focused, under ~500 lines
├── scripts/              # executable code the agent runs
├── references/           # documentation loaded on demand
└── assets/               # templates, configs, static resources
```

Only create directories that the skill actually uses.

## Avoid Canonical Leaks

Meta skills — skills about process, format, or methodology rather than a specific project — must not reference real names, repos, or artifacts from the context in which they were written. Examples should use invented, obviously-placeholder names. A leaked canonical reference creates an unintended dependency and anchors the skill to something that may change or not exist in another user's context.

This skill's own frontmatter is not a template — do not copy its concrete values into new skills. Use the placeholders in the Frontmatter section above.

Project-specific skills are the exception: when a skill is explicitly scoped to a known repo, library, or codebase, proper nouns and real references are appropriate and desirable.

## Scope

A skill should encapsulate one coherent unit of work — narrow enough to trigger precisely, broad enough that it doesn't need a sibling skill loaded alongside it to do its job. If a skill requires another skill to function, either merge them or reconsider the split.

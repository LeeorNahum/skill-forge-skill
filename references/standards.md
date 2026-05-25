# Skill Standards Reference

This file collects the official sources of truth and the distilled rules that matter when authoring or publishing skills.

## Official Sources

- [skill.md](http://skill.md/)
- [OpenCode skills docs](https://opencode.ai/docs/skills/)
- [Cursor skills docs](https://cursor.com/docs/context/skills)

When a standards question comes up, prefer these sources over memory. `skill.md` is the canonical entry point.

## Open Standard Rules

The open Agent Skills standard defines a skill as a directory containing a `SKILL.md` file.

Core requirements:

- `SKILL.md` must begin with YAML frontmatter
- `name` is required
- `description` is required
- `name` should be lowercase, hyphenated, and match the containing skill directory
- `description` should explain what the skill does and when to use it

Common optional fields:

- `license`
- `compatibility`
- `metadata`

Recommended optional directories:

- `references/`
- `scripts/`
- `assets/`

The spec recommends keeping `SKILL.md` focused and using progressive disclosure for deeper material.

## Triggering And Progressive Disclosure

At a high level:

1. agents discover the skill from its metadata
2. they load `SKILL.md` when the description matches the task
3. they only read references, assets, and scripts when `SKILL.md` gives a reason to do so

This means a reference file is not truly part of the skill unless `SKILL.md` tells the agent when to load it.

Weak:

- See `references/` for more.

Strong:

- Read `references/standards.md` when checking naming rules or host-specific directory behavior.

## Directory Expectations

The spec itself says a skill is a directory with `SKILL.md`. It does not require a specific repository layout beyond that.

That leaves room for a practical house standard.

Current working standard for Skill Forge:

- for a single-skill public repo, use the repo root as the skill root
- inside consuming projects, install or mount that repo at `.agents/skills/<skill-name>/`
- keep the skill `name` and installed folder as `<skill-name>`
- allow the public repo name to either match the skill name or use a `-skill` suffix for personal organization

This standard is chosen because it matches the open spec while still working with multiple publishing and installation workflows.

## OpenCode Notes

OpenCode documents these skill locations:

- `.opencode/skills/<name>/SKILL.md`
- `~/.config/opencode/skills/<name>/SKILL.md`
- `.claude/skills/<name>/SKILL.md`
- `~/.claude/skills/<name>/SKILL.md`
- `.agents/skills/<name>/SKILL.md`
- `~/.agents/skills/<name>/SKILL.md`

OpenCode also states:

- unknown frontmatter fields are ignored
- `name` must match the directory containing `SKILL.md`
- `description` must stay within the documented length limit

## Cursor Notes

Cursor documents these skill locations:

- `.agents/skills/`
- `.cursor/skills/`
- `~/.agents/skills/`
- `~/.cursor/skills/`

Cursor also supports compatibility loading from:

- `.claude/skills/`
- `.codex/skills/`
- `~/.claude/skills/`
- `~/.codex/skills/`

Cursor documents:

- `SKILL.md` with YAML frontmatter
- `name` and `description` as required
- optional `scripts/`, `references/`, and `assets/`
- optional `disable-model-invocation` for manual-only skills

## Authoring Implications

When writing or editing a skill:

- keep the core philosophy in `SKILL.md`
- keep conditional detail in `references/`
- preserve the author's important wording when it carries real meaning
- avoid leaking nearby conversational context into a broad meta-skill
- use standards references to answer directory or compatibility questions instead of rewriting the core thesis around them

# Skill Publishing And Layout

This file explains the recommended standard for authoring, installing, and publishing skills.

## Canonical Single-Skill Repo Layout

For a single public skill repo, use the repo root as the skill root:

```text
my-skill-repo/
├── SKILL.md
├── references/
├── scripts/
├── assets/
├── README.md
└── LICENSE
```

Why this layout:

- it is standards-compliant because a skill is a directory, and the repo root is a directory
- it keeps submodule and local-dev workflows simple
- it avoids a redundant extra nesting level for single-skill repos

## Consumer Install Layout

In a project that consumes the skill, install, clone, copy, or submodule it at:

```text
.agents/skills/<skill-name>/
```

That aligns with the shared `.agents/skills/` convention used by modern agents and keeps portability high.

## Repo Naming

Valid approaches:

- repo: `<skill-name>`
- repo: `<skill-name>-skill`
- skill `name`: `<skill-name>`
- installed folder: `<skill-name>`

The repo naming choice is for human organization. The actual skill contract is the installed folder and the `name` field.

## Semver

Use semver in both places:

- `metadata.version` inside `SKILL.md`
- git tag / GitHub release name

Recommended meaning:

- patch: wording, examples, trigger tuning, typo fixes
- minor: new reference material, improved workflow, new supported surfaces
- major: changed scope, renamed skill, changed invocation model, major structural rewrite

## GitHub-Ready Checklist

For a public skill repo, include:

- `SKILL.md`
- `README.md`
- `LICENSE`
- `references/`, `scripts/`, and `assets/` only when needed
- matching semver tag and release when publishing

Useful extras:

- `CHANGELOG.md`
- install examples for `.agents/skills/`
- release notes that explain what changed in agent behavior

`README.md` is not part of the skill spec. Use it as a human skim layer: brief, dense, and easy to understand quickly.

## Sharing And Installation Patterns

Common patterns in the current ecosystem:

- direct clone or copy into `.agents/skills/<skill-name>/`
- git submodule into `.agents/skills/<skill-name>/`
- GitHub-based installation through host-specific UI or CLI
- package-manager style installation from community tools

Do not hard-code one of these as the universal answer unless the user has explicitly chosen it. Treat them as options with different tradeoffs in local development, discoverability, reproducibility, and ecosystem fit. This landscape is still moving, so installation guidance should be framed as options, not doctrine.

## Progressive Disclosure Rule

If a reference, asset, or script matters, `SKILL.md` must say when to read or use it.

Examples:

- Read `references/standards.md` when checking official frontmatter or directory rules.
- Read `references/publishing.md` before drafting install instructions or release notes.

Do not rely on a loose "see references" pointer.

# skill-forge-skill

`skill-forge` is a skill for writing skills well.

It helps an agent preserve high-signal wording, avoid context leakage, write tighter descriptions, and keep `SKILL.md` focused without losing important conditional material.

It is opinionated about quality and meaning, but not about temporary ecosystem preferences that do not change the actual skill contract.

## Files

- `SKILL.md` contains the authoring philosophy and working rules.
- `references/` holds the vendored Agent Skills specification and authoring guides, synced weekly from [agentskills/agentskills](https://github.com/agentskills/agentskills).
- `scripts/sync.mjs` refreshes the vendored references.
- `scripts/validate.mjs` validates any skill directory against the spec and requires clickable support-file routing, zero dependencies.
- `AGENTS.md` is the maintenance contract for editing this skill.

## Install

```bash
git submodule add https://github.com/LeeorNahum/skill-forge-skill.git .agents/skills/skill-forge
```

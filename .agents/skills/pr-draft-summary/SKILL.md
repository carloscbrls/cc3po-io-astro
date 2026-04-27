---
name: pr-draft-summary
description: Create a PR title and draft description after substantive code changes are finished. Trigger when wrapping up a moderate-or-larger change (runtime code, tests, build config, docs with behavior impact) and you need the PR-ready summary block with change summary plus PR draft text.
---

# PR Draft Summary

## When to Use

Trigger this skill when substantial code work is ready for review:
- Changes to runtime code, components, or pages
- Changes to tests or build configuration
- Changes to docs that affect user-facing behavior

Do NOT trigger for every small change or exploratory work.

## What This Skill Produces

1. **Branch name suggestion** — Conventional commit style: `feat/`, `fix/`, `docs/`, `chore/`
2. **PR title** — Conventional commit format
3. **PR description** — Structured with:
   - What changed
   - Why it changed
   - How to verify
   - Any breaking changes
   - Related issues (if any)

## Output Format

```md
# Pull Request Draft

## Branch name suggestion
git checkout -b <type>/<short-description>

## Title
<type>: <description>

## Description
This pull request <what it does>.

It <details of changes>.

It also <additional changes>.

This pull request resolves #<issue> (if applicable).
```

## Rules

- Collect git diff, changed files, and recent commits automatically
- Use Conventional Commits (feat:, fix:, docs:, chore:, refactor:, test:)
- Keep the description factual and specific
- Include verification steps
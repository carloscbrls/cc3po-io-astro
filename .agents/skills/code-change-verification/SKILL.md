---
name: code-change-verification
description: Run the mandatory verification stack when changes affect runtime code, tests, build behavior, or configuration in CC3PO Astro projects.
---

# Code Change Verification

## When to Use

Trigger this skill when changes affect:
- Any file under `src/` (components, pages, layouts, scripts)
- Build configuration (`astro.config.mjs`, `tsconfig.json`, `package.json`)
- Test files
- CI/CD configuration
- Dependencies (`package.json`, `pnpm-lock.yaml`)

Do NOT trigger for docs-only changes (`.md` files with no code impact).

## Verification Stack

Run in this exact order:

1. `pnpm install` — Ensure dependencies are current
2. `pnpm build` — Build must succeed
3. `pnpm lint` — Lint must pass
4. `pnpm check` — Type checking must pass (if configured)

## Rules

- Do NOT mark work complete until all verification steps pass
- If a step fails, fix the issue and re-run the full stack
- Do not skip steps or mark them as "known issues" without explicit approval
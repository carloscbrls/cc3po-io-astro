# AGENTS.md — CC3PO Astro Site

## Project Overview

- Astro static site with islands architecture
- Source lives under `src/` (components, pages, layouts, content)
- Build: `pnpm build` | Dev: `pnpm dev`
- Deploy: Cloud Run via Dockerfile

## Mandatory Skill Usage

- Use `$hipaa-compliance-check` when changes affect forms, patient data handling, API endpoints, or authentication.
- Run `$code-change-verification` when runtime code, tests, or build behavior changes. Do NOT mark work complete until it passes.
- Use `$accessibility-audit` when UI components, pages, layouts, or navigation change. Dental sites MUST be accessible (ADA lawsuit risk).
- Use `$seo-check` when pages, meta tags, routing, sitemap, or structured data changes.
- Use `$content-validation` when blog posts, landing pages, or marketing copy changes.
- Use `$dental-it-review` when changes affect dental-specific features, HIPAA forms, or patient-facing components.
- Use `$performance-check` when build config, asset handling, or deployment settings change.
- Use `$pr-draft-summary` when substantial code work is ready for review.

## Build and Test Commands

- Install: `pnpm install`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Type check: `pnpm check` (if configured)
- Dev server: `pnpm dev`

## Code Style

- TypeScript strict mode
- Astro components: `.astro` files with frontmatter
- CSS: Tailwind utility classes preferred
- Conventional commits: feat:, fix:, docs:, chore:

## Compatibility Rules

- All client-facing pages must be HIPAA-aware
- WCAG 2.1 AA compliance required for all pages
- No PHI in client-side JavaScript or URL parameters
- All third-party services must have BAA for dental clients

## Security

- All secrets via environment variables
- .env.example required, .env.local in .gitignore
- No hardcoded API keys or credentials
- HTTPS enforced on all API endpoints
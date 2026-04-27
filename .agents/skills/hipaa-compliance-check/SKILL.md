---
name: hipaa-compliance-check
description: Scan for PHI exposure, hardcoded credentials, insecure data handling, and HIPAA compliance gaps when changes affect forms, patient data handling, API endpoints, or authentication logic.
---

# HIPAA Compliance Check

## When to Use

Trigger this skill when changes affect:
- Form components (especially JotForm or contact forms)
- API endpoints that handle user/patient data
- Authentication or session management
- Database queries or data storage
- Email handling or notification systems
- Any file under `src/pages/`, `src/components/`, or `src/api/`

## What This Skill Does

1. Runs `scripts/phi-scanner.sh` to scan for hardcoded secrets, PHI patterns, and insecure configurations
2. Reviews the git diff for compliance concerns
3. Checks that environment variables are used (not hardcoded values)
4. Verifies .gitignore covers sensitive files
5. Checks for proper CORS, CSP, and security headers
6. Validates form submissions route through HIPAA-compliant services

## Output Format

For each finding:
- 🔴 **CRITICAL** — PHI exposure or auth bypass (must fix before merge)
- 🟠 **HIGH** — Security risk that could lead to breach
- 🟡 **MEDIUM** — Recommended improvement
- 🟢 **LOW** — Nice to have

## Important Rules

- Do NOT modify any code
- Only report findings
- If critical issues are found, the change MUST NOT be merged
- Reference specific HIPAA rules where applicable (§164.312, §164.502, etc.)
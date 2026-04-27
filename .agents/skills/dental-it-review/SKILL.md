---
name: dental-it-review
description: Review changes for dental-practice-specific IT compliance when changes affect dental landing pages, HIPAA forms, patient portals, dental-specific API integrations, or scheduling/communication features. Enforces OSHA, HIPAA, and state dental board requirements.
---

# Dental IT Review

## When to Use

Trigger when changes affect:
- Dental landing pages or service pages
- HIPAA-compliant forms (JotForm HIPAA)
- Patient portal components
- Dental scheduling integrations
- Insurance or billing features
- Communication features (SMS, email to patients)

## What This Skill Checks

1. **HIPAA §164.312** — Access controls, audit controls, integrity, transmission security
2. **HIPAA §164.502** — Minimum necessary standard for PHI
3. **OSHA compliance** — Safety data, training requirements display
4. **State dental board** — License display, advertising rules
5. **BAA requirements** — Business Associate Agreements for all third-party services
6. **Patient communication** — Secure messaging, no PHI in email subjects
7. **Insurance handling** — No PHI in URL parameters, proper encryption

## Output

For each finding:
- Reference specific regulation (HIPAA §164.xxx, OSHA xxx)
- Risk level and recommended fix
- Whether it blocks deployment

## Revenue

This skill is productizable as a $497 one-time review or $97/mo monitoring service for dental practices.
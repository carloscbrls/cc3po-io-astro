---
name: accessibility-audit
description: Audit pages and components for WCAG 2.1 AA and ADA compliance when UI components, pages, layouts, or navigation change. Critical for dental/healthcare sites under ADA and California AB 434.
---

# Accessibility Audit

## When to Use

Trigger when changes affect:
- Page components or layouts
- Navigation or menu components
- Form components
- Image/media components
- Color themes or CSS that affects contrast
- Interactive elements (modals, dropdowns, carousels)

## What This Skill Checks

### Perceivable
- Images have meaningful alt text
- Color contrast meets WCAG AA (4.5:1 text, 3:1 large text)
- Content readable without CSS
- Text resizable to 200%

### Operable
- All functionality available via keyboard
- Logical focus order
- Visible focus indicators
- Skip navigation links

### Understandable
- `lang` attribute on `<html>`
- Form labels associated with inputs
- Descriptive error messages

### Robust
- Valid HTML
- Correct ARIA usage
- Screen reader compatible

## Output

For each finding: ❌ Fail / ⚠️ Warning / ✅ Pass + WCAG criterion + affected file

## Rules

- Dental sites MUST be accessible (ADA lawsuit risk: $50K-$300K)
- Critical failures block merge
- Reference specific WCAG 2.1 AA success criteria
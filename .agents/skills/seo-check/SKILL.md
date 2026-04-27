---
name: seo-check
description: Check SEO best practices when pages, meta tags, routing, sitemap, or structured data changes. Validates title tags, meta descriptions, heading hierarchy, Open Graph, schema markup, and URL structure.
---

# SEO Check

## When to Use

Trigger when changes affect:
- Page frontmatter (title, description, meta)
- Routing configuration
- Sitemap or robots.txt
- Structured data / schema markup
- Open Graph or Twitter cards
- URL structure or slugs
- Content that affects keyword targeting

## What This Skill Checks

### On-Page SEO
- Title tags: 50-60 chars, includes primary keyword
- Meta descriptions: 150-160 chars, includes CTA
- Heading hierarchy: H1 → H2 → H3, keyword-rich
- Internal linking
- Image alt text
- Schema markup opportunities
- URL slug optimization
- Canonical URLs

### Technical SEO
- Page speed (Lighthouse targets)
- Mobile responsiveness
- Core Web Vitals targets
- Sitemap validity
- Robots.txt configuration
- HTTPS enforcement

### Content
- Keyword density (1-2%)
- Content depth
- Readability score
- Duplicate content

## Output

For each finding: Priority (Critical/High/Medium/Low) + affected files + specific fix
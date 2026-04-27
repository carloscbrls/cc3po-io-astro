---
name: content-validation
description: Validate blog posts, landing pages, and marketing copy for quality, accuracy, broken links, and brand consistency when content files change under src/content/ or src/pages/blog/.
---

# Content Validation

## When to Use

Trigger when changes affect:
- Blog post files (`src/content/blog/`)
- Landing page content
- Marketing copy
- Case studies
- Service descriptions

## What This Skill Checks

1. **Frontmatter completeness** — title, description, pubDate, author, image, tags
2. **Broken links** — Internal and external link verification
3. **Image references** — All images exist and have alt text
4. **Brand consistency** — CC3PO voice and terminology
5. **Spelling/grammar** — Basic proofreading
6. **SEO elements** — Title length, description length, keyword usage
7. **Call-to-action** — Every post has a CTA
8. **Reading level** — Appropriate for dental/business audience

## Output

- ✅ Pass / ❌ Fail per check
- Specific line references for issues
- Suggested fixes
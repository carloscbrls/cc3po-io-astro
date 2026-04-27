---
name: performance-check
description: Check Core Web Vitals, Lighthouse scores, bundle size, and performance best practices when build configuration, page components, asset handling, or deployment settings change.
---

# Performance Check

## When to Use

Trigger when changes affect:
- Build configuration (astro.config, vite config)
- Page components with heavy assets
- Image handling or optimization
- CSS/JS bundle size
- Deployment configuration
- Third-party script loading

## What This Skill Checks

1. **Core Web Vitals**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1
2. **Lighthouse targets**
   - Performance > 90
   - Accessibility > 95
   - Best Practices > 95
   - SEO > 90
3. **Bundle size**
   - No single page > 200KB JS
   - Images optimized (WebP/AVIF)
   - Lazy loading for below-fold
4. **Astro-specific**
   - Proper island architecture usage
   - No unnecessary client directives
   - Prefetching configured correctly

## Output

- Current vs target scores
- Specific optimization recommendations
- Before/after comparison estimates
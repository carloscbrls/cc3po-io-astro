# CC3PO.io - Astro Site

**Live URL:** https://cc3po.io

This is the Astro migration of cc3po.io from Bolt.new to a static Astro site deployed on Netlify.

## Tech Stack

- **Framework:** Astro 5.x
- **Styling:** Custom CSS (dark theme, purple accent)
- **Font:** Inter
- **Deployment:** Netlify

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, stats, problem/solution sections |
| `/framework` | 3X Framework methodology explanation |
| `/case-studies` | Case studies overview with featured examples |
| `/case-studies/3x-productivity-audit` | Detailed case study |
| `/audit` | 3X Productivity Audit landing page |
| `/contact` | Contact information and quick actions |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Option 1: Netlify CLI

```bash
# Login to Netlify (one-time)
netlify login

# Deploy to production
netlify deploy --prod --dir=dist
```

### Option 2: Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com)
2. Connect GitHub repository: `carloscbrls/cc3po-io-astro`
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set custom domain: `cc3po.io`

### Domain Configuration

The domain `cc3po.io` is registered on Name.com and already uses Netlify nameservers:
- `dns1.p06.nsone.net`
- `dns2.p06.nsone.net`
- `dns3.p06.nsone.net`
- `dns4.p06.nsone.net`

## Brand Guidelines

- **Background:** `#0a0a0b`
- **Card:** `#141418`
- **Primary:** `#6b35ff` (purple)
- **Accent:** `#00d2ff` (cyan)
- **Text:** `#fff`
- **Muted:** `#a1a1aa`
- **Gradient:** `linear-gradient(135deg, #6b35ff, #00d2ff)`

## Related Sites

- [cc3po.com](https://cc3po.com) - Main site (Elementor)
- [insights.cc3po.com](https://insights.cc3po.com) - Blog (Astro)
- [offers.cc3po.com](https://offers.cc3po.com) - Services (HTML)
- [audit.cc3po.com](https://audit.cc3po.com) - Audits (HTML)
# External Integrations

**Analysis Date:** 2026-02-04

## APIs & External Services

**Analytics:**
- Google Analytics (UA-275823-1)
  - SDK: Google Tag Manager (gtag.js) loaded via CDN: `https://www.googletagmanager.com/gtag/js`
  - Auth: None (public tracking ID)
  - Implementation: `src/components/ConsentBanner.tsx` - Conditionally loaded based on GDPR consent
  - IP anonymization enabled for GDPR compliance

**Image CDN:**
- Imgix CDN
  - Domain: https://igcn-ws.imgix.net (configurable via PUBLIC_IMGX_DOMAIN env var)
  - SDK/Client: Custom utility functions in `src/utils/imgxUtils.ts`
  - Purpose: Image optimization and CDN delivery for Open Graph images
  - Features: Auto-formatting, quality optimization, responsive srcset generation
  - Implementation: Used in `src/components/SEO.astro` for social sharing images

**Fonts:**
- Google Fonts
  - CDN: https://fonts.googleapis.com
  - Fonts loaded:
    - Inter (300, 400, 500, 600, 700 weights)
    - JetBrains Mono (400, 700 weights)
    - Material Symbols Outlined (variable weight)
  - Implementation: Preconnect and preload in `src/layouts/BaseLayout.astro`

**CDN for External Libraries:**
- jsDelivr (used for preview page)
  - URL: https://cdn.jsdelivr.net/npm/marked/marked.min.js
  - Purpose: Markdown parsing in preview mode
  - File: `src/pages/preview.astro`

## Data Storage

**Databases:**
- None - Static site with Markdown content

**File Storage:**
- Local filesystem in `src/content/` directory
  - Posts: `src/content/posts/`
  - Pages: `src/content/pages/`
  - Projects: `src/content/projects/`
  - Videos: `src/content/videos/`
- Media files in `public/photos/` (managed by TinaCMS)
- Static assets in `public/images/`

**Caching:**
- Astro Content Collections cache (enabled by default in Astro 5)
- Browser cache for static assets (configured in `netlify.toml`)
  - Assets, _astro, JS, CSS: 31536000s (1 year, immutable)
  - Images, photos: 2592000s (30 days)

## Authentication & Identity

**Auth Provider:**
- TinaCMS (tina.io) - Git-based authentication
  - Implementation: Environment variables for client ID and token
  - Auth env vars: `TINA_CLIENT_ID`, `TINA_TOKEN`
  - Auth flow: OAuth via Tina.io, commits to Git repository
  - Development only: Admin interface at `/admin` (protected by TinaCMS auth)

**No User Accounts:**
- No user registration or authentication
- No session management
- No OAuth providers (except TinaCMS for CMS access)

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Rollbar, or similar error tracking service)

**Logs:**
- Build logs: Terminal output and GitHub Actions logs
- No centralized logging service
- Console logging for development debugging

**Performance Monitoring:**
- Lighthouse CI (in GitHub Actions PRs)
  - Config: `lighthouserc.cjs`
  - Runs automatically on pull requests
  - Reports performance metrics via GitHub comments

## CI/CD & Deployment

**Hosting:**
- Netlify (primary production hosting)
  - Site URL: https://ivan.campananaranjo.com
  - Build command: `pnpm run build`
  - Publish directory: `dist`
  - Automatic deployments on git push
  - Preview deployments for pull requests

- Vercel (staging support)
  - Deployed via `scripts/deploy.js` staging command
  - URL: https://staging--ivan-blog.netlify.app (via Netlify)

**CI Pipeline:**
- GitHub Actions (`.github/workflows/ci.yml`)
  - Test job: Lint, TypeScript check, Vitest tests, coverage upload to Codecov
  - Build job: Build project, verify output, upload artifacts
  - Lighthouse CI job: Performance testing on PRs
  - Security job: Trivy vulnerability scanner
  - Deploy preview job: Netlify preview deployments
  - Deploy production job: Netlify production deployment (main branch only)

**Coverage Reporting:**
- Codecov
  - Coverage uploads via `codecov/codecov-action@v4`
  - Directory: `./coverage`
  - Fail CI on error: false (non-blocking)

**Security Scanning:**
- Trivy
  - Action: aquasecurity/trivy-action@master
  - Scan type: Filesystem (fs)
  - Output: SARIF format uploaded to GitHub Code Scanning

## Environment Configuration

**Required env vars:**
- `TINA_CLIENT_ID` - TinaCMS client ID (from tina.io)
- `TINA_TOKEN` - TinaCMS API token (from tina.io)
- `PUBLIC_IMGX_DOMAIN` - Imgix CDN domain (default: https://igcn-ws.imgix.net)
- `PUBLIC_SITE_BASE_URL` - Site base URL (default: https://ivan.campananaranjo.com)

**Required GitHub secrets (for CI/CD):**
- `NETLIFY_AUTH_TOKEN` - Netlify authentication token
- `NETLIFY_SITE_ID` - Netlify site identifier
- `LHCI_GITHUB_APP_TOKEN` - Lighthouse CI GitHub App token

**Secrets location:**
- `.env` file (gitignored, local development)
- GitHub Secrets (CI/CD)
- Netlify Environment Variables (deployment)
- Tina.io Dashboard (CMS credentials)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None (no server-side webhooks)

**GitHub Actions Triggers:**
- Push to main or develop branches
- Pull requests to main branch
- Manual workflows (via `scripts/deploy.js`)

## Third-Party Attribution

**Buy Me a Coffee:**
- Button image served from CDN: `https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png`
- Implementation: Footer component (`src/components/Footer.astro`)

---

*Integration audit: 2026-02-04*

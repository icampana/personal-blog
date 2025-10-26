# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based blog with 370+ posts spanning 20+ years (2004-2025), migrated from Next.js. The site uses TypeScript, Tailwind CSS with DaisyUI, and includes TinaCMS for visual content editing.

## Development Commands

### Development
```bash
# Start dev server with TinaCMS (runs on localhost:4321)
pnpm run dev

# Start Astro only
pnpm run astro dev

# Start TinaCMS dev
pnpm run tina:dev
```

### Building
```bash
# Production build (includes prebuild checks, TinaCMS build, search index, and verification)
pnpm run build

# Preview build (no verification)
pnpm run build:preview

# Content-only build
pnpm run build:content

# Build search index only
pnpm run build:index

# Verify build output
pnpm run build:verify
```

### Testing
```bash
# Run all tests
pnpm run test

# Run tests once (used in CI)
pnpm run test:run

# Test with UI
pnpm run test:ui

# Coverage report
pnpm run test:coverage

# Comprehensive final tests (content, performance, mobile)
pnpm run test:final

# Content validation
pnpm run validate:content

# Performance analysis
pnpm run test:performance

# Mobile responsiveness
pnpm run test:mobile
```

### Linting & Formatting
```bash
# Check code quality with Biome
pnpm run lint

# Auto-fix issues
pnpm run lint:fix

# Format code
pnpm run format

# Format and write
pnpm run format:write
```

### Content Management
```bash
# Fix frontmatter issues
pnpm run fix:frontmatter

# Fix image paths
pnpm run fix:images

# Copy images
pnpm run copy:images

# Migrate content from Next.js
pnpm run migrate:content
```

### Deployment
```bash
# Deploy to production
pnpm run deploy

# Deploy to staging
pnpm run deploy:staging

# Deploy preview
pnpm run deploy:preview
```

## Architecture

### Content Collections

Three main content types defined in `src/content/config.ts`:

- **Posts** (`src/content/posts/`): Blog posts with frontmatter (title, date, featuredImage, tags, description). Legacy fields from WordPress migration (wordpress_id, categories, author).
- **Pages** (`src/content/pages/`): Static pages with similar schema to posts.
- **Projects** (`src/content/projects/`): Portfolio items with galleryImage[], techStack[], liveUrl, repoUrl.

All content uses Zod schemas for validation. Path resolution: posts use `/posts/{path || slug}`, pages use `/{path || slug}`.

### TinaCMS Integration

TinaCMS is configured in `tina/config.ts` and runs alongside Astro in development. The admin interface is accessible at `/admin` and provides visual editing for all content collections. Media files are stored in `public/photos/`. When running production builds, TinaCMS compiles its admin interface which must be included before the Astro build.

**IMPORTANT**: Do NOT create `src/pages/admin.astro` - this will conflict with TinaCMS's own admin interface and cause redirect loops. TinaCMS builds its admin to `public/admin/` and Astro copies it to `dist/` during build. The `/admin/*` route is handled by Netlify redirects in `netlify.toml`.

### Search Implementation

Full-text search powered by Fuse.js with pre-built indexes:

1. Build time: `scripts/build-search-index.js` reads all Markdown files, extracts frontmatter and content, generates search index in `public/search-index.json`
2. Runtime: React components (`SearchComponent.tsx`, `SearchResults.tsx`) load the index and provide fuzzy search
3. Search includes posts, pages, and projects with support for tags, titles, and content

### Layouts & Routing

- **BaseLayout.astro**: Root layout with SEO, theme support, header/footer
- **BlogLayout.astro**: List views for posts (homepage, tag pages, pagination)
- **PostLayout.astro**: Individual post rendering with structured data, share buttons, TOC
- **ProjectLayout.astro**: Portfolio project display with image galleries

File-based routing in `src/pages/`:
- `/posts/[slug].astro`: Dynamic post routes
- `/posts/page/[page].astro`: Pagination
- `/tag/[tag].astro`: Tag filtering
- `/by-date/[year]/[month].astro`: Date-based archives

### Markdown Processing Pipeline

Custom remark/rehype plugins configured in `astro.config.mjs`:

- **remark-gfm**: GitHub Flavored Markdown (tables, task lists, strikethrough)
- **remark-breaks**: Convert line breaks to `<br>` tags
- **remark-emoji**: Parse emoji shortcodes
- **remark-directive**: Support for custom directives (:::note, :::warning, etc.)
- **unified-admonitions** (`src/lib/unified-admonitions.js`): Transform directives into styled components
- **remark-youtube** (`src/lib/remark-youtube.js`): Embed YouTube videos
- **rehype-slug**: Add IDs to headings for TOC
- **rehype-highlight**: Syntax highlighting for code blocks

### Styling System

- **Tailwind CSS v4**: Utility-first styling using CSS-based configuration
  - Uses `@tailwindcss/vite` plugin instead of PostCSS
  - Configuration in `src/styles/globals.css` using `@import "tailwindcss"`
  - **No `tailwind.config.js` or `postcss.config.cjs`** - configuration is now CSS-based
  - Built-in autoprefixing (no separate autoprefixer dependency needed)
  - Requires `@reference` directive in Astro `<style>` blocks that use `@apply` with theme variables
- **DaisyUI v5**: Component library with 29 themes available
  - Configured as CSS plugin: `@plugin "daisyui" { themes: ... }`
  - Major class name changes from v4 (see upgrade notes below)
- **Theme switching**: System preference detection with localStorage persistence
- **Global styles**: `src/styles/globals.css` (includes all Tailwind and DaisyUI config)

### React Islands

Interactive React components hydrated on demand:

- **SearchComponent.tsx**: Client-side search with debounced input
- **SearchResults.tsx**: Result rendering with highlighting
- **ImageGallery.tsx**: Lightbox gallery for project images
- **ShareButtons.tsx**: Social sharing functionality
- **BackToTop.tsx**: Scroll-to-top button
- **CopyToClipboard.tsx**: Code block copy functionality
- **ConsentBanner.tsx**: Custom GDPR consent management (replaces external consent manager)

### Social Sharing & SEO

The `SEO.astro` component handles all meta tags for social sharing:

- Uses **imgix CDN** (`https://igcn-ws.imgix.net`) for Open Graph images
- Images are optimized to 1200x630px (recommended for WhatsApp/Facebook)
- Includes required tags: `og:image`, `og:image:secure_url`, `og:image:width`, `og:image:height`, `og:image:alt`, `og:image:type`
- Twitter Card support with `summary_large_image`
- Full structured data (JSON-LD) for search engines

**Testing social previews**: Use Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/) to clear WhatsApp cache and test previews.

### GDPR Consent Management

Custom cookie consent implementation in `ConsentBanner.tsx`:

- **No external dependencies** - fully self-hosted solution
- Stores preferences in localStorage (`gdpr-consent-preferences`)
- Conditionally loads Google Analytics based on user consent
- Implements IP anonymization for GDPR compliance
- Privacy settings page at `/privacy-settings`
- Link in footer for easy access to cookie preferences

Users can:
- Accept all / Reject all / Customize preferences
- View current consent status
- Change preferences at any time

### Performance Optimizations

Build configuration includes:
- Manual chunks for vendor code splitting (react-vendor, search-vendor, utils-vendor)
- Image optimization with responsive images and lazy loading
- Long-term caching for assets (31536000s for immutable assets, 2592000s for images)
- Compression headers configured in `netlify.toml`

### Legacy Redirects

Multiple redirect patterns handle WordPress/Gatsby URLs:
- `/category/*` → `/tag/*`
- `/:year/:month/:slug` → `/posts/:slug`
- Numeric pagination (`/1`, `/2`) → `/posts/page/1`, etc.

All redirects configured in both `astro.config.mjs` and `netlify.toml`.

## Code Quality Tools

- **Biome**: Linting and formatting (replaces ESLint + Prettier)
  - Configured in `biome.json`
  - Enforces import type usage and unused variable detection
  - Single quotes for JavaScript
  - Ignores Astro files, scripts, and generated directories
- **TypeScript**: Strict mode enabled via `astro/tsconfigs/strict`
- **Vitest**: Unit and integration testing with jsdom environment
  - Setup file: `src/test/setup.ts`
  - Path aliases configured: `@/`, `@/components`, `@/utils`, `@/lib`

## Testing Patterns

Tests are located in `src/test/`:
- `src/test/components/`: Component tests using Testing Library
- `src/test/integration/`: Integration tests for content collections, routing, search

The test suite validates:
- Component rendering and interactions
- Content schema validation
- Search index generation and querying
- Route resolution and pagination

## Environment & Deployment

- **Hosting**: Netlify (primary), with Vercel support
- **Node**: v20+, pnpm v9+
- **Build command**: `pnpm run build:production` (lints, tests, builds TinaCMS, generates search index, builds Astro, verifies output)
- **Environments**:
  - Production: https://ivan.campananaranjo.com
  - Staging: Uses `build:preview` (skips verification)
  - Deploy previews: Automatic for PRs

## Important Notes

- **CRITICAL**: Always run `pnpm run lint:fix` after generating or editing any files, and before committing changes. This ensures all code complies with Biome formatting and linting guidelines.
- Always run `pnpm run test:run` before committing (included in prebuild)
- Search index must be regenerated after content changes (automatically done in build)
- TinaCMS must build before Astro build in production
- **Never create `src/pages/admin.astro`** - conflicts with TinaCMS admin interface
- Image paths should use `/photos/` for content images (served from `public/photos/`)
- The site supports remote images from `igcn-ws.imgix.net` domain
- Open Graph images automatically use imgix CDN for optimal social sharing
- Content collections are cached by default in Astro 5
- Google Analytics only loads if user consents via GDPR banner

## Tailwind v4 & DaisyUI v5 Upgrade Notes

**Upgraded on**: October 2025 from Tailwind CSS v3.4.18 and DaisyUI v4.12.24

### Key Changes Made

1. **Dependencies**:
   - Added: `tailwindcss@4.1.16`, `daisyui@5.3.10`, `@tailwindcss/vite@4.1.16`
   - Removed: `@astrojs/tailwind`, `autoprefixer`, `postcss`

2. **Configuration Files**:
   - **Deleted**: `tailwind.config.js` and `postcss.config.cjs` (no longer needed)
   - **Updated**: `src/styles/globals.css` now contains all configuration
   - **Updated**: `astro.config.mjs` uses `@tailwindcss/vite` plugin in `vite.plugins[]`

3. **CSS Configuration** (`src/styles/globals.css`):
   ```css
   @import "tailwindcss";

   @plugin "daisyui" {
     themes: light --default, dark --prefersdark, cupcake, bumblebee, ...;
   }
   ```

4. **Astro Components with Scoped Styles**:
   - All `<style>` blocks using `@apply` with theme variables now require `@reference` directive
   - Example:
   ```astro
   <style>
     @reference "../styles/globals.css";

     .prose {
       @apply text-base-content;
     }
   </style>
   ```
   - Files updated: `PostLayout.astro`, `ProjectLayout.astro`, `content/[...slug].astro`, `portafolio/[...slug].astro`

### DaisyUI v5 Breaking Changes Applied

1. **Utility Name Changes**:
   - `rounded-sm` → `rounded-xs`
   - `shadow-sm` → `shadow-xs`
   - `blur-sm` → `blur-xs`
   - `ring` → `ring-3`
   - `outline-none` → `outline-hidden`

2. **Component Class Changes**:
   - `input-bordered` → `input` (inputs now have borders by default)
   - `form-control` → Removed (use standard HTML `<label>` or `<fieldset>`)
   - `label-text` → Removed (use standard styling)
   - Components updated: `ConsentBanner.tsx`, `SearchComponent.tsx`

3. **Other Changes**:
   - Inputs, selects, and textareas now have borders by default
   - Use `*-ghost` variants to remove borders (e.g., `input-ghost`)
   - Footer is vertical by default (use `footer-horizontal` for horizontal layout)

### Important Considerations

- **Browser Support**: Tailwind v4 requires Safari 16.4+, Chrome 111+, Firefox 128+
- **No JavaScript Config**: All configuration must be done in CSS
- **Scoped Styles**: Always use `@reference` in Astro `<style>` blocks that use theme variables
- **CSS Variables**: All theme values are available as CSS variables (e.g., `var(--color-primary)`)
- **Performance**: Vite plugin provides better performance than the old PostCSS integration

### Rollback Instructions (if needed)

If you need to rollback to Tailwind v3 + DaisyUI v4:

```bash
# Restore old dependencies
pnpm add -D tailwindcss@3 daisyui@4 @astrojs/tailwind autoprefixer postcss
pnpm remove @tailwindcss/vite

# Restore config files from git history
git checkout HEAD~1 -- tailwind.config.js postcss.config.cjs

# Restore old globals.css imports
# Restore old astro.config.mjs integration setup
# Remove @reference directives from Astro components
# Restore old DaisyUI class names
```

## Common Issues & Solutions

### TinaCMS Admin Redirect Loop
- **Symptom**: `/admin` redirects in a loop or shows a blank page
- **Cause**: `src/pages/admin.astro` file exists and conflicts with TinaCMS
- **Solution**: Delete `src/pages/admin.astro` - TinaCMS handles the admin route

### WhatsApp Preview Not Showing Images
- **Symptom**: Shared links show title but no image preview
- **Cause**: Open Graph image tags missing or using local URLs
- **Solution**: Images automatically use imgix CDN via `SEO.astro`. Clear WhatsApp cache using Facebook Sharing Debugger

### GDPR Consent Banner Issues
- **Reset consent**: Clear localStorage key `gdpr-consent-preferences` or visit `/privacy-settings`
- **Analytics not loading**: Check browser console, verify consent was given, check Google Analytics ID in BaseLayout
- **Testing**: Use incognito mode to see fresh banner on each page load

### Tailwind v4 / DaisyUI v5 Build Errors
- **Symptom**: Build fails with "Cannot apply unknown utility class `text-base-content`" or similar theme variable errors
- **Cause**: Astro `<style>` blocks using `@apply` with DaisyUI theme variables need `@reference` directive
- **Solution**: Add `@reference "../styles/globals.css"` (or appropriate relative path) at the top of the `<style>` block before any `@apply` statements
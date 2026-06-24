# Codebase Structure

**Analysis Date:** 2026-02-04

## Directory Layout

```
icampana-blog2/
├── .planning/          # GSD planning artifacts
├── docs/               # Project documentation (AI_CONTEXT.md)
├── public/             # Static assets served directly (photos/, images/, search-index.json)
├── scripts/            # Build scripts and utilities (search index, image optimization, content validation)
├── src/                # Application source code
│   ├── components/     # Reusable UI components (Astro .astro and React .tsx)
│   ├── config/         # Application configuration
│   ├── content/        # Markdown content collections
│   │   ├── posts/      # Blog posts (370+ files)
│   │   ├── pages/      # Static pages
│   │   ├── projects/   # Portfolio items
│   │   └── videos/     # Video content
│   ├── layouts/        # Page layout wrappers
│   ├── lib/            # Custom remark/rehype plugins
│   ├── pages/          # File-based routes
│   ├── styles/         # Global styles (globals.css with Tailwind v4 + DaisyUI v5)
│   ├── test/           # Vitest tests
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions (date formatting, image URLs, reading time)
├── tina/               # TinaCMS configuration and generated files
├── coverage/           # Test coverage reports (generated)
├── dist/               # Production build output (generated)
├── .astro/             # Astro build cache (generated)
└── node_modules/       # Dependencies (ignored)
```

## Directory Purposes

**src/components/:**
- Purpose: Reusable UI components for layouts and interactive features
- Contains: Astro components (.astro) for static rendering, React components (.tsx) for islands
- Key files: `SEO.astro` (meta tags), `ConsentBanner.tsx` (GDPR), `SearchComponent.tsx` (search UI), `Footer.astro`, `Header.astro`

**src/layouts/:**
- Purpose: Page layout composition and common page structure
- Contains: BaseLayout.astro (root layout), BlogLayout.astro (list views), PostLayout.astro (single posts), ProjectLayout.astro (portfolio)
- Key files: `BaseLayout.astro` (HTML skeleton, theme, fonts, consent banner), `PostLayout.astro` (article with TOC, share buttons)

**src/pages/:**
- Purpose: File-based routing for all public URLs
- Contains: Dynamic routes ([slug], [tag], [page]), static routes (index, videos, search, archivo)
- Key files: `index.astro` (homepage), `posts/[...slug].astro` (blog posts), `posts/page/[page].astro` (pagination), `tag/[tag].astro` (tag filtering)

**src/content/:**
- Purpose: Markdown content storage with frontmatter
- Contains: posts/, pages/, projects/, videos/ collections
- Key files: `config.ts` (Zod schemas for all collections)
- Note: Path resolution: posts use `/posts/{path || slug}`, pages use `/{path || slug}`

**src/lib/:**
- Purpose: Custom Markdown processing plugins
- Contains: remark-youtube.js, unified-admonitions.js, search-index.ts
- Key files: `remark-youtube.js` (YouTube embeds), `unified-admonitions.js` (callout components)

**src/utils/:**
- Purpose: Shared utility functions
- Contains: client.ts (URL generation, date formatting), imageUtils.ts, imgxUtils.ts (CDN URLs), index.ts (reading time)
- Key files: `client.ts` (getPostUrl, getPageUrl, getProjectUrl, formatDate), `imgxUtils.ts` (generateImgxUrl for CDN)

**src/styles/:**
- Purpose: Global styles and theme configuration
- Contains: globals.css
- Key files: `globals.css` (Tailwind v4 + DaisyUI v5 configuration with CSS plugins)
- Note: Astro components using `@apply` with theme variables need `@reference` directive

**src/test/:**
- Purpose: Vitest test suites
- Contains: components/ (unit tests), integration/ (E2E-style tests), utils.test.ts, setup.ts
- Key files: `setup.ts` (test environment setup), `SearchComponent.test.tsx`, `imageUtils.test.ts`

**scripts/:**
- Purpose: Build automation and utilities
- Contains: build-search-index.js, optimize-images.js, validate-content.js, deploy.js, verify-build.js
- Key files: `build-search-index.js` (FlexSearch index generation), `validate-content.js` (frontmatter validation)

**tina/:**
- Purpose: TinaCMS configuration and generated admin interface
- Contains: config.ts, templates.ts, tina-lock.json, __generated__/ (admin build output)
- Key files: `config.ts` (collection schemas, field definitions), `templates.ts` (shared field templates)
- Note: Admin interface builds to `admin/` and is copied to `dist/` during build

**public/:**
- Purpose: Static assets served at root URL
- Contains: photos/ (CMS uploads), images/ (site images), search-index.json, search-posts.json, favicon.svg
- Key files: `search-index.json` (FlexSearch index), `search-posts.json` (searchable items)

## Key File Locations

**Entry Points:**
- `src/pages/index.astro`: Homepage
- `src/pages/posts/[...slug].astro`: Blog post display (catch-all for legacy date URLs)
- `src/pages/posts/[year]/[month]/[slug].astro`: Date-based post URLs
- `src/pages/posts/index.astro`: All posts list (paginated)
- `src/pages/tag/[tag].astro`: Tag-filtered posts
- `src/pages/search.astro`: Search results page

**Configuration:**
- `astro.config.mjs`: Astro build config, integrations (React, sitemap, MDX), remark/rehype plugins, redirects, vite plugins
- `src/content/config.ts`: Content collection schemas (Zod)
- `tina/config.ts`: TinaCMS collection configuration
- `netlify.toml`: Build settings, headers, redirects, deployment environment
- `biome.json`: Linting and formatting rules

**Core Logic:**
- `src/utils/client.ts`: URL generation (getPostUrl, getPageUrl, getProjectUrl), date formatting, tag filtering, post sorting
- `src/utils/imgxUtils.ts`: imgix CDN URL generation with dimensions
- `src/components/SEO.astro`: Open Graph, Twitter Cards, structured data generation
- `src/components/ConsentBanner.tsx`: GDPR consent management

**Build Process:**
- `scripts/build-search-index.js`: Generates FlexSearch index for all content
- `scripts/verify-build.js`: Validates build output
- `scripts/deploy.js`: Deployment automation

**Testing:**
- `src/test/setup.ts`: Vitest environment configuration
- `src/test/components/`: Component tests using React Testing Library
- `src/test/integration/`: Content validation and search tests

## Naming Conventions

**Files:**
- **Astro components**: PascalCase with `.astro` extension (e.g., `SEO.astro`, `PostCard.astro`)
- **React components**: PascalCase with `.tsx` extension (e.g., `SearchComponent.tsx`, `ConsentBanner.tsx`)
- **Utilities**: camelCase with `.ts` extension (e.g., `client.ts`, `imgxUtils.ts`)
- **Pages**: lowercase with dynamic segments in brackets (e.g., `[slug].astro`, `[tag].astro`, `page/[page].astro`)
- **Content files**: Date-prefixed for posts (YYYY-MM-DD-title.md), otherwise kebab-case (e.g., `sobre-mi.md`)

**Directories:**
- **Content collections**: plural (e.g., `posts/`, `pages/`, `projects/`, `videos/`)
- **Dynamic routes**: use bracket notation for params (e.g., `[slug]/`, `[tag]/`, `[year]/[month]/`)
- **Utility categories**: camelCase (e.g., `components/`, `utils/`, `layouts/`)

## Where to Add New Code

**New Feature (UI Component):**
- Primary code: `src/components/NewComponent.astro` (static) or `NewComponent.tsx` (interactive)
- Tests: `src/test/components/NewComponent.test.tsx`
- Import pattern: Use absolute imports with `@/` alias if configured

**New Feature (Page Route):**
- Implementation: `src/pages/new-route/index.astro` or `src/pages/new-route.astro`
- Dynamic routes: `src/pages/new-route/[param].astro`
- Tests: `src/test/integration/route.test.ts`

**New Content Collection Type:**
- Schema: Add to `src/content/config.ts` using `defineCollection`
- Directory: Create `src/content/new-type/`
- TinaCMS: Add collection to `tina/config.ts`
- Scripts: Update `scripts/build-search-index.js` to index new type

**New Utility Function:**
- Implementation: `src/utils/newUtility.ts` (or add to existing `client.ts`, `index.ts`)
- Tests: `src/test/utils.test.ts`

**New Markdown Plugin:**
- Implementation: `src/lib/remark-new-plugin.js` or `src/lib/rehype-new-plugin.js`
- Registration: Add to `astro.config.mjs` under `markdown.remarkPlugins` or `markdown.rehypePlugins`

## Special Directories

**tina/__generated__:**
- Purpose: TinaCMS admin interface build output
- Generated: Yes (by `tinacms build`)
- Committed: No (in .gitignore)
- Note: Copied to `dist/admin/` during Astro build, served via Netlify redirect

**public/photos/:**
- Purpose: CMS-uploaded media files
- Generated: No (user-uploaded)
- Committed: Yes (content assets)
- Note: Configured as TinaCMS media root, served directly

**.astro/ and dist/:**
- Purpose: Astro build cache and production output
- Generated: Yes (by Astro build)
- Committed: No (in .gitignore)
- Note: `dist/` contains final static site for deployment

**coverage/:**
- Purpose: Test coverage reports
- Generated: Yes (by `vitest --coverage`)
- Committed: No (in .gitignore)

---

*Structure analysis: 2026-02-04*

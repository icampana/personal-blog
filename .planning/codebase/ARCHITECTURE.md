# Architecture

**Analysis Date:** 2026-02-04

## Pattern Overview

**Overall:** Static Site Generator with Content Collections and Headless CMS Integration

**Key Characteristics:**
- **Build-time content processing**: Markdown files processed at build time into static HTML
- **Content-driven routing**: File-based routing derived from content collections
- **Islands architecture**: React components hydrated on demand for interactivity
- **Pre-built search index**: Client-side search using FlexSearch with build-time indexing
- **Legacy URL compatibility**: Extensive redirect system for WordPress/Gatsby/Blogger migrations

## Layers

**Content Layer:**
- Purpose: Markdown-based content storage with frontmatter validation
- Location: `src/content/`
- Contains: `posts/`, `pages/`, `projects/`, `videos/`
- Depends on: Zod schemas (`src/content/config.ts`)
- Used by: Astro content collections, TinaCMS, search index generator

**Routing Layer:**
- Purpose: File-based route generation from content collections
- Location: `src/pages/`
- Contains: Dynamic routes (`[slug].astro`, `[page].astro`, `[tag].astro`, date routes)
- Depends on: Astro's `getCollection` and `getStaticPaths`
- Used by: Browser navigation, redirects

**Presentation Layer:**
- Purpose: HTML rendering and layout composition
- Location: `src/layouts/`, `src/components/`
- Contains: BaseLayout.astro, BlogLayout.astro, PostLayout.astro, ProjectLayout.astro
- Depends on: Content collections, components
- Used by: All page routes

**Interactivity Layer:**
- Purpose: Client-side interactive features
- Location: `src/components/*.tsx`
- Contains: SearchComponent.tsx, ConsentBanner.tsx, ImageGallery.tsx, ThemeToggle.tsx
- Depends on: React, Astro's client directives
- Used by: BaseLayout.astro and specific pages

**Build Layer:**
- Purpose: Content transformation and asset processing
- Location: `scripts/`, `astro.config.mjs`
- Contains: remark/rehype plugins, search index generator, image optimization
- Depends on: Astro build system, Vite
- Used by: Production build process

**CMS Layer:**
- Purpose: Visual content editing in development
- Location: `tina/config.ts`, `tina/templates/`
- Contains: TinaCMS configuration, collection field definitions
- Depends on: TinaCMS runtime
- Used by: Development environment (`/admin`)

## Data Flow

**Content Rendering Flow:**

1. Markdown files in `src/content/{type}/` are read by Astro's content collections
2. Frontmatter is validated against Zod schemas in `src/content/config.ts`
3. Content body is processed through remark/rehype plugins (GFM, emoji, YouTube, admonitions, syntax highlighting)
4. `getStaticPaths()` generates route parameters for dynamic routes
5. Pages render content using layout components (BaseLayout → BlogLayout/PostLayout)
6. React islands hydrate interactive components with `client:load` directive

**Search Flow:**

1. Build time: `scripts/build-search-index.js` reads all Markdown files
2. Extracts frontmatter and body content using gray-matter
3. Indexes content using FlexSearch (title, summary, content fields)
4. Exports index to `public/search-index.json` and items to `public/search-posts.json`
5. Runtime: SearchComponent.tsx loads index, SearchResults.tsx queries and renders results

**CMS Editing Flow:**

1. Developer opens `/admin` (handled by TinaCMS, not Astro)
2. TinaCMS reads content files and templates from `tina/config.ts`
3. User edits content via rich-text editor
4. Changes saved directly to Markdown files
5. Astro dev server hot-reloads updated content

**GDPR Consent Flow:**

1. Initial page load: ConsentBanner.tsx checks localStorage for `gdpr-consent-preferences`
2. No consent found: Show banner with Accept/Reject/Customize options
3. User makes choice: Preferences saved to localStorage
4. BaseLayout.astro checks consent before loading Google Analytics script
5. Analytics only injected if analytics consent is true

## Key Abstractions

**Content Collections:**
- Purpose: Type-safe content access with schema validation
- Examples: `src/content/config.ts` defines `posts`, `pages`, `projects`, `videos` collections
- Pattern: `defineCollection` with Zod schema → `getCollection('type')` → typed CollectionEntry

**URL Generation:**
- Purpose: Consistent URL generation for different content types with legacy support
- Examples: `src/utils/client.ts` (getPostUrl, getPageUrl, getProjectUrl)
- Pattern: Check `path` frontmatter field first, fallback to slug-based URL with date handling

**Image Processing:**
- Purpose: Optimized image delivery with CDN integration
- Examples: `src/utils/imgxUtils.ts` (generateImgxUrl), `src/utils/imageUtils.ts` (normalizeImagePath)
- Pattern: Normalize local paths, generate imgix CDN URLs with dimensions

**Theme Management:**
- Purpose: System/theme toggle with persistence
- Examples: `src/components/ThemeToggle.tsx`, inline theme script in BaseLayout.astro
- Pattern: localStorage persistence with `data-theme` attribute, theme-change library

**Search Indexing:**
- Purpose: Client-side fuzzy search without server
- Examples: `scripts/build-search-index.js`, FlexSearch Document type
- Pattern: Build-time index generation → JSON export → Client-side querying

## Entry Points

**Development Server:**
- Location: `pnpm run dev` → runs `tinacms dev -c "astro dev"`
- Triggers: Developer start command
- Responsibilities: Starts TinaCMS on separate port, Astro dev server on 4321

**Production Build:**
- Location: `pnpm run build:production` → `prebuild` → `tinacms build` → `build-index` → `astro build` → `build:verify`
- Triggers: Deployment or manual build
- Responsibilities: Lint, test, build TinaCMS admin, generate search index, build Astro, verify output

**Homepage:**
- Location: `src/pages/index.astro`
- Triggers: Root URL (`/`)
- Responsibilities: Renders hero section, latest posts, latest videos, structured data

**Post Routes:**
- Location: `src/pages/posts/[...slug].astro`, `src/pages/posts/[year]/[month]/[slug].astro`
- Triggers: Dynamic slug-based URLs
- Responsibilities: Render individual blog posts with related posts, share buttons, back-to-top

**Tag Pages:**
- Location: `src/pages/tag/[tag].astro`
- Triggers: `/tag/{tagname}` URLs
- Responsibilities: Filter posts by tag, display paginated results

**Archive/Date Pages:**
- Location: `src/pages/posts/page/[page].astro`, `src/pages/by-date/[year]/[month].astro`
- Triggers: Pagination and date-based browsing
- Responsibilities: Paginated post lists, date-filtered posts

**Search Page:**
- Location: `src/pages/search.astro`
- Triggers: `/search?q={query}` URLs
- Responsibilities: Display search results with highlighting

## Error Handling

**Strategy:** Astro's built-in error boundaries with Netlify 404 page

**Patterns:**
- **Content validation**: Zod schemas throw errors on invalid frontmatter at build time
- **404 handling**: Custom `src/pages/404.astro` with Netlify fallback
- **Redirect handling**: Middleware (`src/middleware.ts`) and `netlify.toml` for legacy URLs
- **Build verification**: `scripts/verify-build.js` checks for critical files (index.html, assets, search index)
- **Search errors**: Graceful degradation if search index fails to load (fallback to empty results)

## Cross-Cutting Concerns

**Logging:** Console logging in build scripts, minimal runtime logging
**Validation:** Zod schemas for all content collections frontmatter
**Authentication:** No auth required (public content), TinaCMS uses env vars (`TINA_CLIENT_ID`, `TINA_TOKEN`)
**Internationalization:** Spanish locale for date formatting (`date-fns/es`)
**SEO:** Comprehensive SEO component (`src/components/SEO.astro`) with Open Graph, Twitter Cards, structured data
**Accessibility:** Semantic HTML, ARIA labels, keyboard navigation support
**Performance:** Static generation, image optimization, long-term caching headers, code splitting with manual chunks

---

*Architecture analysis: 2026-02-04*

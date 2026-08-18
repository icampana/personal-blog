# Keystatic Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace TinaCMS with Keystatic (local mode) and standardize content i18n to per-locale directories, with zero URL changes.

**Architecture:** Content moves from flat `.md` + `.en/.pt/.fr` suffixed siblings to `{es,en,pt,fr}/<slug>.md` directories per content type. Locale is derived from the first path segment instead of a filename suffix. Keystatic (`storage: {kind:'local'}`) edits only the Spanish `es/` dirs with a Markdoc body field writing `.md` files. TinaCMS is removed entirely.

**Tech Stack:** Astro 7, Keystatic (`@keystatic/astro` + `@keystatic/core`), Node 22, pnpm 10, Vitest, FlexSearch, Gemini translate script.

## Global Constraints

- **Zero URL changes**: slugs must resolve identically before/after; no redirects added for content moves.
- **Spanish-only CMS editing**: Keystatic collections point at `es/` dirs only; translations are script-generated.
- **Translations moved, not regenerated**: existing `.en/.pt/.fr` files are relocated byte-for-byte.
- **Markdown bodies preserved**: migration script never rewrites body content or frontmatter.
- **TinaCMS removed in full**: `tina/`, `public/admin/`, `tinacms` + `@tinacms/cli`, `build-tina-conditional.js`, `tina:dev`/`tina:build` scripts, `/admin/*` rewrite.
- **Round-trip gate before Tina removal**: markdoc must parse representative legacy posts; failures become frontmatter-only (documented), not rewritten.
- Locale codes: `es` (default), `en`, `pt`, `fr`.

---

### Task 1: Migration script `scripts/migrate-layout.mjs`

**Files:**
- Create: `scripts/migrate-layout.mjs`
- Test: `src/test/integration/migrate-layout.test.ts`

**Interfaces:**
- Produces: `resolveTarget(relPath: string): string | null` — given a path relative to a content-type dir (e.g. `foo.en.md`, `slug/index.pt.md`), returns the new relative path (`en/foo.md`, `pt/slug.md`) or `null` when not a content file. Later tasks and the round-trip gate rely on the resulting directory layout.

- [ ] **Step 1: Write the failing test**

`src/test/integration/migrate-layout.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { resolveTarget } from '../../scripts/migrate-layout.mjs';

describe('resolveTarget', () => {
  it('moves flat Spanish files into es/', () => {
    expect(resolveTarget('2023-01-15-mi-post.md')).toBe('es/2023-01-15-mi-post.md');
  });

  it('moves suffixed flat files into their locale dir with suffix stripped', () => {
    expect(resolveTarget('2023-01-15-mi-post.en.md')).toBe('en/2023-01-15-mi-post.md');
    expect(resolveTarget('2023-01-15-mi-post.pt.md')).toBe('pt/2023-01-15-mi-post.md');
    expect(resolveTarget('2023-01-15-mi-post.fr.md')).toBe('fr/2023-01-15-mi-post.md');
  });

  it('flattens folder-style Spanish posts', () => {
    expect(resolveTarget('2004-06-24-foo/index.md')).toBe('es/2004-06-24-foo.md');
  });

  it('flattens folder-style translations', () => {
    expect(resolveTarget('mi-post/index.en.md')).toBe('en/mi-post.md');
    expect(resolveTarget('mi-post/index.pt.md')).toBe('pt/mi-post.md');
    expect(resolveTarget('mi-post/index.fr.md')).toBe('fr/mi-post.md');
  });

  it('returns null for non-content files', () => {
    expect(resolveTarget('subdir/notes.txt')).toBeNull();
    expect(resolveTarget('.DS_Store')).toBeNull();
  });

  it('rejects suffix collisions on the same slug', () => {
    // both map to es/foo.md -> collision must be caught by the caller
    expect(resolveTarget('foo.md')).toBe('es/foo.md');
    expect(resolveTarget('foo/index.md')).toBe('es/foo.md');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/test/integration/migrate-layout.test.ts`
Expected: FAIL — module `../../scripts/migrate-layout.mjs` not found.

- [ ] **Step 3: Implement `scripts/migrate-layout.mjs`**

```js
#!/usr/bin/env node
/**
 * Migrates content from the flat/suffixed layout to per-locale directories.
 * Dry-run by default; pass --apply to write.
 *
 *   foo.md         -> es/foo.md
 *   foo.en.md      -> en/foo.md
 *   slug/index.md  -> es/slug.md
 *   slug/index.en.md -> en/slug.md
 */
import fs from 'fs';
import path from 'path';

const CONTENT_TYPES = ['posts', 'pages', 'projects', 'videos'];
const LOCALE_SUFFIXES = ['en', 'pt', 'fr'];
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');

/**
 * Map a path relative to a content-type dir (e.g. "foo.en.md") to the new
 * relative path under the locale layout. Returns null for non-content files.
 */
export function resolveTarget(relPath) {
  const dir = path.posix.dirname(relPath);
  const base = path.posix.basename(relPath);

  if (dir !== '.' && dir !== 'index') return null; // only flat or folder/index files

  let locale = 'es';
  let name = base;

  for (const suffix of LOCALE_SUFFIXES) {
    if (base === `index.${suffix}.md`) {
      locale = suffix;
      name = path.posix.basename(dir) + '.md';
      return `${locale}/${name}`;
    }
    if (base.endsWith(`.${suffix}.md`)) {
      locale = suffix;
      name = base.replace(`.${suffix}.md`, '.md');
      return `${locale}/${name}`;
    }
  }

  if (base === 'index.md') {
    name = path.posix.basename(dir) + '.md';
  } else if (!base.endsWith('.md')) {
    return null;
  }

  return `${locale}/${name}`;
}

function collectFiles(contentDir) {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else out.push(path.relative(contentDir, full));
    }
  };
  walk(contentDir);
  return out;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const dry = !apply;
  const all = [];
  const collisions = new Set();

  for (const type of CONTENT_TYPES) {
    const contentDir = path.join(ROOT, 'src', 'content', type);
    if (!fs.existsSync(contentDir)) continue;
    const files = collectFiles(contentDir);
    for (const rel of files) {
      const target = resolveTarget(rel);
      if (!target) continue;
      const key = `${type}/${target}`;
      if (collisions.has(key)) {
        console.error(`✗ COLLISION: ${type}/${rel} -> ${target}`);
        process.exitCode = 1;
      }
      collisions.add(key);
      all.push({ type, from: rel, to: target });
    }
  }

  for (const { type, from, to } of all) {
    const fromFull = path.join(ROOT, 'src', 'content', type, from);
    const toFull = path.join(ROOT, 'src', 'content', type, to);
    console.log(`${dry ? '[dry]' : '[move]'} ${type}/${from} -> ${type}/${to}`);
    if (!dry) {
      fs.mkdirSync(path.dirname(toFull), { recursive: true });
      fs.renameSync(fromFull, toFull);
    }
  }

  console.log(`\n${all.length} files ${dry ? 'would be moved' : 'moved'} (${apply ? 'apply' : 'dry-run'}).`);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/test/integration/migrate-layout.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Verify dry-run against the real content**

Run: `node scripts/migrate-layout.mjs`
Expected: lists every content file with its target; no `COLLISION` lines; summary count ≈ 369 Spanish + translated files (posts 389 total pre-migration, plus pages/projects/videos).

- [ ] **Step 6: Commit**

```bash
git add scripts/migrate-layout.mjs src/test/integration/migrate-layout.test.ts
git commit -m "feat(scripts): add per-locale layout migration script (dry-run)"
```

---

### Task 2: Apply the content migration

**Files:**
- Modify: all files under `src/content/{posts,pages,projects,videos}` (moved by the script)
- Verify: `scripts/migrate-layout.mjs`

**Interfaces:**
- Consumes: `resolveTarget` from Task 1.
- Produces: new on-disk layout `src/content/<type>/{es,en,pt,fr}/<slug>.md`; content collection ids become `es/<slug>`, `en/<slug>`, etc.

- [ ] **Step 1: Run the migration with --apply**

Run: `node scripts/migrate-layout.mjs --apply`
Expected: files moved; no `COLLISION` output; exit code 0.

- [ ] **Step 2: Verify the new layout**

Run: `ls src/content/posts/es | head; ls src/content/posts/en | head; find src/content -name '*.en.md' | wc -l`
Expected: `es/` and `en/` populated; `find … '*.en.md'` returns 0.

- [ ] **Step 3: Verify the git history of today's article survived**

Run: `git status --short src/content/posts/es | head`
Expected: the article moved to `src/content/posts/es/2026-08-how-i-work-with-ai-agents-context-and-memory.md` (and `en/…` if the translation existed) — content unchanged.

- [ ] **Step 4: Commit**

```bash
git add -A src/content
git commit -m "refactor(content): move content into per-locale directories"
```

---

### Task 3: Path-based i18n helpers + tests

**Files:**
- Modify: `src/utils/i18n.ts`
- Modify: `src/test/i18n.test.ts`

**Interfaces:**
- Consumes: new ids (`es/<slug>`, `en/<slug>`, …) from Task 2.
- Produces (same exported names, new path-based semantics):
  - `getLanguageFromFilename(id): Locale | null` — first path segment if `es|en|pt|fr`, else null.
  - `stripLanguageSuffix(id): string` — drops the locale prefix segment.
  - `getCleanSlug(id): string` — locale prefix stripped, date prefix stripped, `.md`/`/index` removed.
  - `getPostsByLocale(posts, locale)` — filter by first segment.
  - `getAvailableTranslations(posts, baseSlug)`, `hasTranslation(posts, baseSlug, locale)`, `getLocaleFromPath`, `stripLocalePrefix`, `getLocalizedUrl` — unchanged behavior.

- [ ] **Step 1: Write the failing tests**

Replace the contents of `src/test/i18n.test.ts` with:

```ts
import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import {
  getLanguageFromFilename,
  getPostsByLocale,
  getCleanSlug,
  LOCALES,
  type Locale,
  POSTS_PER_PAGE,
} from '../utils/i18n';

const mockPost = (id: string): CollectionEntry<'posts'> => ({
  id,
  body: '',
  collection: 'posts',
  data: { title: id, date: new Date('2023-01-15') },
  render: async () => ({ Content: () => null, headings: [] }),
});

describe('getLanguageFromFilename (path-based)', () => {
  it('derives locale from the first path segment', () => {
    expect(getLanguageFromFilename('es/2023-01-15-mi-post')).toBe('es');
    expect(getLanguageFromFilename('en/2023-01-15-mi-post')).toBe('en');
    expect(getLanguageFromFilename('pt/2023-01-15-mi-post')).toBe('pt');
    expect(getLanguageFromFilename('fr/2023-01-15-mi-post')).toBe('fr');
  });

  it('returns null for ids without a locale segment', () => {
    expect(getLanguageFromFilename('2023-01-15-mi-post')).toBeNull();
  });
});

describe('getCleanSlug (path-based)', () => {
  it('strips locale prefix, date prefix and extension', () => {
    expect(getCleanSlug('es/2023-01-15-mi-post')).toBe('mi-post');
    expect(getCleanSlug('en/2023-01-15-mi-post')).toBe('mi-post');
  });

  it('keeps slugs without date prefix', () => {
    expect(getCleanSlug('en/mi-post')).toBe('mi-post');
  });
});

describe('getPostsByLocale', () => {
  const esPost = mockPost('es/2023-01-15-mi-post');
  const enPost = mockPost('en/2023-01-15-mi-post');
  const frPost = mockPost('fr/2023-01-15-mi-post');
  const ptPost = mockPost('pt/2023-01-15-mi-post');
  const posts = [esPost, enPost, frPost, ptPost];

  it('returns only es posts for the default locale', () => {
    const result = getPostsByLocale(posts, LOCALES.DEFAULT);
    expect(result.map((p) => p.id)).toEqual(['es/2023-01-15-mi-post']);
  });

  it('returns only posts for the requested locale', () => {
    expect(getPostsByLocale(posts, LOCALES.ENGLISH).map((p) => p.id)).toEqual([
      'en/2023-01-15-mi-post',
    ]);
    expect(getPostsByLocale(posts, LOCALES.PORTUGUESE).map((p) => p.id)).toEqual([
      'pt/2023-01-15-mi-post',
    ]);
  });

  it('handles Spanish slugs that naturally end in "en" without ambiguity', () => {
    const esEndsInEn = mockPost('es/2009-03-27-cansancio-dolor-y-estres-convertidos-en');
    expect(getPostsByLocale([esEndsInEn], LOCALES.DEFAULT).map((p) => p.id)).toEqual([
      'es/2009-03-27-cansancio-dolor-y-estres-convertidos-en',
    ]);
    expect(getPostsByLocale([esEndsInEn], LOCALES.ENGLISH)).toEqual([]);
  });
});

describe('POSTS_PER_PAGE', () => {
  it('is defined and positive', () => {
    expect(POSTS_PER_PAGE).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/test/i18n.test.ts`
Expected: FAIL — `getLanguageFromFilename('es/2023-01-15-mi-post')` returns null (old suffix regex), etc.

- [ ] **Step 3: Rewrite `src/utils/i18n.ts`**

Replace lines 16–19 (the `LANGUAGE_SUFFIX_REGEX`) and the suffix-based helpers with path-based logic. Keep everything else (LOCALES, POSTS_PER_PAGE, getLocaleFromPath, stripLocalePrefix, getLocalizedUrl, hasTranslation, getAvailableTranslations) as-is:

```ts
// Locale is now the first path segment of a collection id (es/foo, en/foo).
const LOCALE_SEGMENT = new Set(['es', 'en', 'pt', 'fr']);

/**
 * Extract language from a content collection id (first path segment).
 */
export function getLanguageFromFilename(id: string): Locale | null {
  const first = id.split('/')[0];
  return LOCALE_SEGMENT.has(first) ? (first as Locale) : null;
}

/**
 * Strip the locale prefix segment from a collection id.
 */
export function stripLanguageSuffix(id: string): string {
  const lang = getLanguageFromFilename(id);
  return lang ? id.slice(lang.length + 1) : id;
}

/**
 * Get clean slug (without locale prefix, date prefix, extension, and /index).
 */
export function getCleanSlug(slug: string): string {
  let cleanSlug = stripLanguageSuffix(slug).replace(/\.md$/i, '').replace(/\/?index$/, '');

  if (cleanSlug.match(/^\d{4}-\d{2}-\d{2}-/)) {
    const parts = cleanSlug.split('-');
    cleanSlug = parts.slice(3).join('-');
  }

  return cleanSlug;
}
```

Then replace `getPostsByLocale` (lines 107–134) with:

```ts
export function getPostsByLocale(
  posts: CollectionEntry<'posts'>[],
  locale: Locale,
): CollectionEntry<'posts'>[] {
  return posts.filter((post) => getLanguageFromFilename(post.id) === locale);
}
```

Remove the old `LANGUAGE_SUFFIX_REGEX` constant and the `getPostsByLocale` helper function `getLang`/`ids` logic.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/test/i18n.test.ts`
Expected: PASS.

- [ ] **Step 5: Run the full test suite**

Run: `pnpm test:run`
Expected: PASS. If `content.test.ts` or `routes.test.ts` assert on old ids, update those fixtures to the path-based ids (e.g. `posts/es/...`, `pages/es/...`) in this same step.

- [ ] **Step 6: Commit**

```bash
git add src/utils/i18n.ts src/test/i18n.test.ts src/test/integration
git commit -m "refactor(i18n): derive locale from path segment instead of filename suffix"
```

---

### Task 4: Sweep consumers to path-based ids

**Files:**
- Modify (only where they break): `src/utils/client.ts`, `src/layouts/PostLayout.astro`, `src/components/Header.astro`, `src/pages/{archivo.astro,index.astro,videos.astro}`, `src/pages/posts/[...slug].astro`, `src/pages/posts/[year]/[month]/[slug].astro`, `src/pages/{en,pt,fr}/posts/[...slug].astro`, `src/pages/{en,pt,fr}/content/[...slug].astro`, `src/pages/{en,pt,fr}/portafolio/[...slug].astro`, `src/pages/{en,pt,fr}/videos.astro`, `src/pages/{en,pt,fr}/index.astro`, `src/pages/content/[...slug].astro`, `src/pages/portafolio/[...slug].astro`, `src/pages/tag/[tag].astro`, `src/pages/by-date/[year]/[month].astro`, `src/pages/rss.xml.ts`, `src/middleware.ts`
- Verify: full build + tests

**Interfaces:**
- Consumes: path-based helpers from Task 3 (same names).
- Produces: all routes resolve `es/<slug>`/`en/<slug>` ids into unchanged URLs.

- [ ] **Step 1: Grep for leftover suffix assumptions**

Run:
```bash
rg -n "\.en\.md|\.fr\.md|\.pt\.md|LANGUAGE_SUFFIX|endsWith\('en'\)|endsWith\(\"en\"\)" src/ --glob '!src/content/**'
```
Expected: only hits in `scripts/build-search-index.js` (handled in Task 5) and none in `src/`.

- [ ] **Step 2: Build to surface breakage**

Run: `pnpm astro build`
Expected: build either succeeds or fails with a clear list of pages whose `getStaticPaths` can't resolve a slug. For each failure, the fix is to use the helpers from Task 3 — the most common pattern to replace is manual `post.id` parsing like:

```astro
const lang = getLanguageFromFilename(post.id);      // still works
const cleanSlug = getCleanSlug(post.id);            // still works
```

Fix only the lines the compiler/typecheck flags. Do not rewrite working pages.

- [ ] **Step 3: Run full suite again**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages src/components src/layouts src/utils src/middleware.ts
git commit -m "fix(routing): path-based locale ids across all content consumers"
```

---

### Task 5: Update translate + search scripts

**Files:**
- Modify: `scripts/translate-content.mjs`
- Modify: `scripts/build-search-index.js`

**Interfaces:**
- Consumes: new layout from Task 2.
- Produces: translations written to `<lang>/<slug>.md`; search index derives locale from path segment.

- [ ] **Step 1: Update `scripts/translate-content.mjs`**

Replace `CONTENT_DIRS` and the target-path logic:

```js
const CONTENT_DIRS = [
  'src/content/posts/es',
  'src/content/pages/es',
  'src/content/projects/es',
  'src/content/videos/es',
];
```

In `translateFile`, replace the target-path generation (line ~100):

```js
// Generate target path: src/content/posts/es/foo.md -> src/content/posts/en/foo.md
const targetPath = filePath.replace('/es/', `/${targetLang}/`);
```

Remove the `ignore` glob option and the `.en/.pt/.fr` skip logic in `processDirectory` (the `es/` dirs contain only Spanish sources now):

```js
const files = await glob(`${dir}/**/*.md`);

for (const file of files) {
  for (const targetLang of TARGET_LANGUAGES) {
    await translateFile(file, targetLang);
  }
  processed++;
}
```

Keep the date cutoff, prompts, Gemini call, and skip-if-exists logic unchanged.

- [ ] **Step 2: Update `scripts/build-search-index.js`**

Replace the regex helpers (lines 11–29) with path-based ones:

```js
// Locale is the first path segment: es/foo.md, en/foo.md
function getLanguageFromFilename(filename) {
  const first = filename.split('/')[0];
  return ['es', 'en', 'pt', 'fr'].includes(first) ? first : null;
}

function stripLanguageSuffix(filename) {
  const locale = getLanguageFromFilename(filename);
  return locale ? filename.split('/').slice(1).join('/') : filename;
}
```

Keep the rest of `generateSearchIndex` unchanged — `slug = path.basename(file, '.md')` is now correct because folder-style posts were flattened in Task 2 (this also fixes the previous `index` slug bug for folder posts).

- [ ] **Step 3: Rebuild the search index**

Run: `pnpm run build:index`
Expected: index generated; `rg -c '"type":"post"' public/search-index.json` roughly matches post count; URLs like `/posts/<slug>` and `/en/posts/<slug>`.

- [ ] **Step 4: Dry-run translation skip logic**

Run: `node scripts/translate-content.mjs 2>&1 | head -30`
Expected: sources found under `es/`; existing translations skipped; no file written without a `GEMINI_API_KEY` guard failure.

- [ ] **Step 5: Commit**

```bash
git add scripts/translate-content.mjs scripts/build-search-index.js public/search-index.json
git commit -m "feat(scripts): path-based locales in translate and search-index scripts"
```

---

### Task 6: Keystatic integration + config

**Files:**
- Create: `keystatic.config.ts`
- Modify: `astro.config.mjs`
- Modify: `package.json` (deps)
- Verify: `src/pages/keystatic/[...route].astro` (created by the integration in dev if required)

**Interfaces:**
- Consumes: layout from Task 2 (Spanish `es/` dirs).
- Produces: `/keystatic` admin (dev) editing `src/content/{posts,pages,projects,videos}/es/*`; media uploads into `public/photos`.

- [ ] **Step 1: Install dependencies**

Run:
```bash
pnpm add @keystatic/core @keystatic/astro
```
Expected: both packages in `package.json` dependencies.

- [ ] **Step 2: Add the integration to `astro.config.mjs`**

```js
import keystatic from '@keystatic/astro';
// ...
integrations: [react(), sitemap(), mdx(), keystatic()],
```

- [ ] **Step 3: Create `keystatic.config.ts`**

```ts
import { collection, config, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: 'Iván Gabriel — Blog' } },
  collections: {
    posts: collection({
      label: 'Posts (ES)',
      slugField: 'title',
      path: 'src/content/posts/es/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Publication Date' }),
        description: fields.text({ label: 'Short Description', multiline: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Tag',
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/photos',
          publicPath: '/photos',
        }),
        body: fields.markdoc({
          label: 'Body',
          extension: 'md',
        }),
      },
    }),
    pages: collection({
      label: 'Pages (ES)',
      slugField: 'title',
      path: 'src/content/pages/es/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        path: fields.text({ label: 'Path' }),
        description: fields.text({ label: 'Short Description', multiline: true }),
        body: fields.markdoc({ label: 'Body', extension: 'md' }),
      },
    }),
    projects: collection({
      label: 'Projects (ES)',
      slugField: 'title',
      path: 'src/content/projects/es/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        description: fields.text({ label: 'Description', multiline: true }),
        galleryImage: fields.array(
          fields.image({
            label: 'Image',
            directory: 'public/photos',
            publicPath: '/photos',
          }),
          { label: 'Gallery', itemLabel: (props) => props.value || 'Image' },
        ),
        techStack: fields.array(fields.text({ label: 'Tech' }), {
          label: 'Tech Stack',
          itemLabel: (props) => props.value || 'Tech',
        }),
        liveUrl: fields.url({ label: 'Live URL' }),
        repoUrl: fields.url({ label: 'Repo URL' }),
        body: fields.markdoc({ label: 'Body', extension: 'md' }),
      },
    }),
    videos: collection({
      label: 'Videos (ES)',
      slugField: 'title',
      path: 'src/content/videos/es/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        videoId: fields.text({ label: 'YouTube Video ID' }),
        date: fields.date({ label: 'Date' }),
        description: fields.text({ label: 'Description', multiline: true }),
        featured: fields.checkbox({ label: 'Featured' }),
        body: fields.markdoc({ label: 'Body', extension: 'md' }),
      },
    }),
  },
});
```

- [ ] **Step 4: Verify the Keystatic route mounts in dev**

Run: `pnpm exec astro dev` (NOT `pnpm dev` — at this point the `dev` script still wraps tinacms; it becomes plain `astro dev` in Task 8, Step 3), then load `http://localhost:4321/keystatic`.
Expected: Keystatic admin UI loads; posts collection lists the Spanish posts from `src/content/posts/es/`.

- [ ] **Step 5: Media-dir verification**

In the admin, upload an image to a post. Check: file lands in `public/photos/` and the frontmatter `featuredImage` points to `/photos/<file>`.
Expected: matches the existing `/photos` convention. If the image field writes elsewhere, adjust `directory`/`publicPath` in `keystatic.config.ts`.

- [ ] **Step 6: Commit**

```bash
git add keystatic.config.ts astro.config.mjs package.json pnpm-lock.yaml
git commit -m "feat(cms): add Keystatic local-mode config for Spanish content"
```

---

### Task 7: Round-trip gate (markdoc parses legacy content)

**Files:**
- Create: `scripts/keystatic-roundtrip.mjs`
- Output: `keystatic-roundtrip-report.json` (gitignored or committed — decide by size)

**Interfaces:**
- Consumes: `keystatic.config.ts` from Task 6.
- Produces: a list of posts that fail markdoc parsing → those become frontmatter-only (documented), never rewritten.

- [ ] **Step 1: Write the round-trip script**

`scripts/keystatic-roundtrip.mjs`:

```js
#!/usr/bin/env node
/**
 * Reads every Spanish post through Keystatic's reader and reports any that
 * fail markdoc parsing. These posts are frontmatter-only in the CMS.
 */
import fs from 'fs/promises';
import path from 'path';
import { createReader } from '@keystatic/core/reader';
import config from '../keystatic.config.ts'; // resolved via tsx/ts-node — see Step 2

const reader = createReader(process.cwd(), config);
const report = { ok: [], failed: [] };

for (const slug of await reader.collections.posts.list()) {
  try {
    await reader.collections.posts.read(slug);
    report.ok.push(slug);
  } catch (err) {
    report.failed.push({ slug, error: err.message });
  }
}

await fs.writeFile(
  path.join(process.cwd(), 'keystatic-roundtrip-report.json'),
  JSON.stringify(report, null, 2),
);
console.log(`OK: ${report.ok.length} | FAILED: ${report.failed.length}`);
console.log('Failed:', report.failed.map((f) => f.slug).join('\n  '));
```

- [ ] **Step 2: Run it (TS config via a loader)**

Run:
```bash
node --experimental-strip-types scripts/keystatic-roundtrip.mjs 2>&1 | tail -20
```
If the TS config import fails, run with `tsx`:
```bash
pnpm dlx tsx scripts/keystatic-roundtrip.mjs 2>&1 | tail -20
```
Expected: `OK:` count ≈ Spanish post count; `FAILED` lists posts whose bodies use syntax markdoc cannot parse (likely `:::note` directives, YouTube embeds).

- [ ] **Step 3: Review the failed list and record the frontmatter-only set**

Decide with the user: for each failed slug, either (a) accept as frontmatter-only (record in `keystatic-roundtrip-report.json`), or (b) fix the body syntax if trivial and safe. Do NOT rewrite bodies in this task.

- [ ] **Step 4: Commit**

```bash
git add scripts/keystatic-roundtrip.mjs keystatic-roundtrip-report.json
git commit -m "test(cms): markdoc round-trip gate on legacy posts"
```

**GATE:** Do NOT proceed to Task 8 until this report is reviewed and accepted.

---

### Task 8: Remove TinaCMS in full

**Files:**
- Delete: `tina/` (config, templates, `__generated__`, `tina-lock.json`)
- Delete: `public/admin/`
- Delete: `scripts/build-tina-conditional.js`
- Modify: `package.json`
- Modify: `netlify.toml`
- Modify: docs (`CLAUDE.md`, `docs/AI_CONTEXT.md`, `docs/TRANSLATION_WORKFLOW.md`)

**Interfaces:**
- Consumes: everything before it (Keystatic works, round-trip accepted).
- Produces: no TinaCMS remnants anywhere.

- [ ] **Step 1: Remove deps**

Run: `pnpm remove tinacms @tinacms/cli`
Expected: removed from `package.json` + lockfile.

- [ ] **Step 2: Delete Tina files**

Run: `rm -rf tina public/admin scripts/build-tina-conditional.js`

- [ ] **Step 3: Update `package.json` scripts**

- `dev`: `astro dev`
- Remove `tina:dev`, `tina:build`
- `build:production`: remove `&& node scripts/build-tina-conditional.js` — it becomes:
  `pnpm run prebuild && node scripts/build-search-index.js && astro build && pnpm run postbuild`

- [ ] **Step 4: Remove the `/admin` rewrite from `netlify.toml`**

Delete:
```toml
# Admin panel redirect for TinaCMS
[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200
```

- [ ] **Step 5: Update docs**

- `CLAUDE.md`: replace the TinaCMS section with a Keystatic section (local mode, `/keystatic`, Spanish-only, translate script); remove the `/admin` warnings.
- `docs/AI_CONTEXT.md`: update Tech Stack + data flows (TinaCMS → Keystatic), remove the Tina invariants.
- `docs/TRANSLATION_WORKFLOW.md`: update file structure to per-locale dirs; source dirs are `es/`.

- [ ] **Step 6: Verify no remnants**

Run:
```bash
rg -ri "tinacms|tina:" --glob '!node_modules/**' --glob '!pnpm-lock.yaml' .
```
Expected: no hits (except maybe `docs/superpowers/specs/*-keystatic-migration-design.md` historical mentions).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore(cms): remove TinaCMS entirely (deps, scripts, redirects, docs)"
```

---

### Task 9: Final verification

**Files:**
- Verify: full build, tests, smoke

**Interfaces:**
- Consumes: all tasks.
- Produces: green build + working local CMS.

- [ ] **Step 1: Full test suite**

Run: `pnpm test:run`
Expected: all pass.

- [ ] **Step 2: Production build**

Run: `pnpm run build:production`
Expected: lints, tests, search index, astro build, verify — all green.

- [ ] **Step 3: URL parity smoke**

Run: `node scripts/migrate-layout.mjs` (dry-run) — should report 0 files to move.
Then spot-check built output:
```bash
ls dist/posts | head; ls dist/en/posts | head
```
Expected: existing slugs present; article at `/posts/<slug>` (es) and `/en/posts/<slug>`.

- [ ] **Step 4: Local CMS smoke**

Run: `pnpm dev` → open `http://localhost:4321/keystatic` → edit the title of a Spanish post → Save.
Expected: `src/content/posts/es/<slug>.md` frontmatter updates on disk; no PUT error.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: verify keystatic migration (tests, build, smoke)"
```

---

## Self-Review Notes

- **Spec coverage:** spec §5.1/§6 → Tasks 1–2; §7 → Tasks 3–5; §5.2/§10.1 → Tasks 6–7; §8 → Task 8; §10.2–10.4 → Task 9; §11 sequence matches task order. The round-trip gate (§9 risk row 1) is Task 7 and hard-blocks Task 8.
- **Placeholders:** none — every code step contains full code.
- **Type consistency:** `resolveTarget` (Task 1) is imported by the test with the same name; `getLanguageFromFilename`/`getCleanSlug`/`getPostsByLocale` (Task 3) keep their names so Task 4 consumers need no signature changes; `createReader(process.cwd(), config)` (Task 7) matches `@keystatic/core/reader`'s API.

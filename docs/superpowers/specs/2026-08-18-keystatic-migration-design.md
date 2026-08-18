# Keystatic Migration — Design

Date: 2026-08-18
Status: Approved
Author: Iván + agent (brainstorming session)

## 1. Context

The blog currently uses **TinaCMS** as its content editor. After the tinacms dependency
bump to 3.12.0 (1 day old at time of writing), the local write path regressed:
every `updateDocument` fails with an opaque `Error in PUT` (the `originalError` is
suppressed client- and server-side). The regression is universal — it reproduces on a
fresh, freshly-indexed dev instance across all collections (posts, pages, projects,
videos), including tiny documents. Reads work; writes don't.

Independent of the immediate regression, TinaCMS is over-engineered for this site:
datalayer server (port 9000), GraphQL server (4001), a separate admin build, a dev
wrapper around Astro, and recurring version/glob churn (`*.md.md` match footgun).
The one feature that justifies that weight — on-page inline visual editing — was
never functional here.

**Decision:** migrate the content editing layer to **Keystatic** (`@keystatic/astro` +
`@keystatic/core`), and standardize the i18n content layout while we're at it. The blog
is already published and static; this is not an emergency. TinaCMS is removed in full.

## 2. Goals

- Restore content editing (local dev) on a simpler, file-based CMS.
- Standardize i18n: replace the `.en/.pt/.fr` filename-suffix convention with
  per-locale directories.
- Zero URL changes: existing routes and slugs must resolve identically.
- Remove all TinaCMS code, deps, build steps, and redirects.
- Keep existing translations byte-for-byte (move, do not regenerate).
- Migrate deliberately via a written plan, executable across sessions.

## 3. Non-goals (out of scope for this effort)

- Public/production editing (Keystatic GitHub/Cloud mode) — planned later, not now.
- Converting legacy custom directive syntax (`:::note`, YouTube embeds) to Markdoc —
  flagged, documented, not rewritten.
- Rewriting 370+ posts' bodies.

## 4. Key decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Keystatic over TinaCMS | File/git-based, no datalayer/GraphQL/ports; Astro integration is official |
| D2 | Per-locale directories (`{es,en,pt,fr}/<slug>.md`) | Standard Astro i18n; deletes the suffix-regex machinery |
| D3 | Spanish-only CMS editing | Matches current workflow (Spanish = source of truth; translations are script-generated) |
| D4 | Full Tina removal in one effort | Migration is the fix; keeping a broken CMS adds nothing; git is the rollback |
| D5 | Markdoc body field with `extension: 'md'` | Approach A chosen by user: WYSIWYG editing, writes `.md` files |
| D6 | Existing translations moved, not regenerated | Preserves hand edits (e.g., the 2026-08 article) |
| D7 | Normalize folder-style posts (`<slug>/index.md`) to flat files | Removes the index-file edge case; slug/URL unchanged |
| D8 | Keystatic `storage: { kind: 'local' }` first | Local editing now; public editing later |

## 5. Target architecture

### 5.1 Content layout

```
src/content/
├── posts/
│   ├── es/<slug>.md        # source of truth
│   ├── en/<slug>.md        # generated translations
│   ├── pt/<slug>.md
│   └── fr/<slug>.md
├── pages/{es,en,pt,fr}/…
├── projects/{es,en,pt,fr}/…
└── videos/{es,en,pt,fr}/…
```

- URLs unchanged: `/posts/<slug>` (es), `/en/posts/<slug>`, `/pt/…`, `/fr/…`.
- Folder-style legacy posts are flattened (`<slug>/index.md` → `es/<slug>.md`).

### 5.2 Keystatic config (`keystatic.config.ts`, project root)

- `storage: { kind: 'local' }`.
- 4 collections, Spanish-only, one per content type:
  - `posts`: `path: 'src/content/posts/es/*'` — title (slug), date (datetime), tags
    (array), description (textarea), featuredImage (image), body (`fields.markdoc`,
    `extension: 'md'`).
  - `pages`: + `path` field.
  - `projects`: + `galleryImage` (array), `techStack` (array), `liveUrl`, `repoUrl`.
  - `videos`: + `videoId`.
- Admin route: `/keystatic` (dev only). No production admin surface yet.
- Uploaded media follows the existing `/photos` convention (media-dir wiring verified
  during implementation).
- `astro.config.mjs`: add `keystatic()` to integrations (`@astrojs/react` already present).

### 5.3 Data flow

1. Editor edits Spanish source in `/keystatic` → writes `src/content/posts/es/<slug>.md`.
2. `pnpm run translate` (Gemini script) generates `en|pt|fr/<slug>.md`, skipping
   existing files.
3. Astro build reads all locale dirs via the existing glob loaders; i18n helpers
   derive locale from the path segment; static pages render.

## 6. Migration mechanics

`scripts/migrate-layout.mjs` (dry-run by default; `--apply` to write):

- `foo.md` → `es/foo.md`
- `foo.en.md` → `en/foo.md`; `.pt`, `.fr` likewise
- `<slug>/index.md` → `es/<slug>.md`; `<slug>/index.en.md` → `en/<slug>.md`, etc.
- Applies to posts, pages, projects, videos.
- Verifies: file counts per locale before/after; no slug collisions; no URL changes.
- Does NOT modify body content or frontmatter.

## 7. Code changes

- `src/utils/i18n.ts` — locale from first path segment; `getCleanSlug` strips locale
  prefix, date prefix, extension; delete the suffix-regex helpers.
- `src/content.config.ts` — loader globs and schema unchanged.
- Consumers (via i18n helpers): `index.astro`, pagination, tag pages, by-date archive,
  `posts/[slug]`, `content/[...slug]`, `PostCard`, language switcher `hasTranslation`
  (match by slug across locale dirs), sitemap, RSS.
- `scripts/translate-content.mjs` — source from `es/` dirs; write
  `<lang>/<slug>.md`; skip-if-exists on new paths.
- Search index script — locale from path segment.

## 8. Tina removal checklist

- Delete `tina/` (config, templates, generated schema, lock).
- Delete `public/admin/` (generated).
- Remove deps: `tinacms`, `@tinacms/cli`.
- Delete `scripts/build-tina-conditional.js`; drop its step from `build:production`.
- Remove scripts `tina:dev`, `tina:build`; `dev` becomes `astro dev`.
- Remove the `/admin/*` rewrite from `netlify.toml`.
- Remove Tina references from docs (`CLAUDE.md`, `docs/AI_CONTEXT.md`,
  `docs/TRANSLATION_WORKFLOW.md`) — update to Keystatic + new layout.

## 9. Known risks & mitigations

| Risk | Mitigation |
|------|-----------|
| Markdoc re-serialization normalizes legacy bodies on edit | Round-trip test first; posts with unparseable directives are flagged frontmatter-only |
| Markdoc throws on unknown legacy tags (`:::note`, embeds) | Same as above; documented, not rewritten |
| Slug collision during flattening | Migration script verifies uniqueness before applying |
| Route/URL drift | Migration dry-run + build smoke test confirm identical slugs |
| Keystatic media dir mismatch | Verify `/photos` media wiring during implementation |

## 10. Verification plan

1. **Round-trip test:** open representative legacy posts (admonitions, YouTube
   embeds, GFM tables, folder-style) through `fields.markdoc` with `extension: 'md'`;
   confirm parse/no-mangle; record which posts are frontmatter-only.
2. **Tests:** update i18n/routing/search tests to path-based locales; full suite passes.
3. **Build:** `pnpm run build:production` clean; sitemap/RSS/search index generated;
   sampled URLs render identically.
4. **Smoke:** local `/keystatic` loads; edit + save a Spanish post writes the expected
   file.

## 11. Rollout sequencing (for the implementation plan)

1. Migration script (TDD: dry-run + verification) → content move commit.
2. `i18n.ts` + consumers + tests (path-based locales).
3. `translate-content.mjs` + search index updates.
4. Keystatic config + integration + media wiring.
5. **Round-trip gate:** markdoc parse test on representative legacy posts. Posts
   that fail become frontmatter-only (documented). Do NOT proceed to Tina removal
   until this gate passes (or the failure list is explicitly accepted).
6. Tina removal (deps, scripts, redirects, docs).
7. Verification: tests, build, smoke (`/keystatic` loads; edit + save a Spanish post).

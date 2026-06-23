# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Upgraded Astro framework from 5.x to 7.0.0.
- Upgraded `@astrojs/mdx` to 7.0.0, `@astrojs/react` to 6.0.0, `@vitejs/plugin-react` to 6.0.3, `vite` to 8.1.0, `@astrojs/markdown-remark` to 7.2.0, and `marked` to 18.0.5.
- Upgraded safe dependencies: `@astrojs/sitemap` 3.7.3, `sharp` 0.35.2, `glob` 13.0.6, `jsdom` 29.1.1, `theme-change` 3.0.4.
- Migrated content collections from `src/content/config.ts` to `src/content.config.ts` using Astro 7 `glob` loaders.
- Replaced deprecated `entry.render()` with imported `render(entry)` from `astro:content`.
- Replaced removed `entry.slug` with `entry.id` across layouts, pages, components, utilities, and tests.
- Replaced `ViewTransitions` with `ClientRouter` in `BaseLayout.astro`.
- Updated markdown pipeline in `astro.config.mjs` to use `@astrojs/markdown-remark`'s `unified()` processor with inline plugins.
- Updated `manualChunks` to a function to satisfy Vite 8 typing.
- Updated `marked` usage in Tina preview components to `marked.parse()`.
- Fixed `biome.json` schema version and ignored generated `public/admin.css`.

### Fixed
- Fixed `scripts/validate-content.js` image parsing to correctly handle absolute `/photos/` paths, angle-bracket URLs with spaces, and quoted titles.
- Fixed unclosed `<div>` in `src/pages/index.astro`.
- Fixed Netlify production build OOM by aligning `NODE_VERSION`/`PNPM_VERSION` with local toolchain and adding `NODE_OPTIONS=--max-old-space-size=6144`.

### Removed
- Legacy `src/content/config.ts` content collection configuration file.
- Stale `@ts-ignore` comment in `astro.config.mjs`.

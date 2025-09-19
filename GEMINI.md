# Gemini Project Context

This document provides context for the Gemini AI assistant to understand the project better.

## Project Overview

This is a blog website built with Next.js and TypeScript. It uses Contentlayer to manage content from Markdown files and TinaCMS for a visual editor. The styling is done with Tailwind CSS and daisyUI. The blog is entirely in **Spanish**.

## Key Technologies

- **Framework:** Next.js
- **Language:** TypeScript
- **Content:** Contentlayer (from Markdown files), TinaCMS
- **Styling:** Tailwind CSS, daisyUI
- **Linting:** Biome (previously ESLint)
- **Package Manager:** PNPM

### Linting Configuration

This project uses Biome for linting and formatting. The configuration is defined in `biome.json`. Specific rules, such as `noDangerouslySetInnerHtml` and `useUniqueElementIds`, are handled by disabling them for specific files or globally where their use is intentional and deemed safe (e.g., rendering trusted Markdown content or static IDs for single-instance elements).

## Project Structure

- `content/posts`: Contains the blog post content in Markdown files.
- `components`: Contains the React components.
- `pages`: Contains the Next.js pages.
- `public`: Contains static assets.
- `styles`: Contains global CSS files.
- `lib`: Contains library code, such as the search index generation.
- `tina`: Contains the TinaCMS configuration.

## Important Commands

- `pnpm dev`: Starts the development server with Turbopack and TinaCMS.
- `pnpm build`: Builds the project, including Contentlayer, the search index, and the Next.js application.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Lints the codebase using Biome.
- `pnpm lint:fix`: Automatically fixes linting and formatting issues using Biome.
- `pnpm clean`: Removes build artifacts and caches.

## Recent Improvements and Features

### Linting Fixes

-   **Resolved Biome Linting Errors:** Addressed numerous linting issues reported by Biome, including:
    -   `lint/complexity/noUselessFragments`: Replaced unnecessary React fragments with `null` returns.
    -   `lint/style/useNodejsImportProtocol`: Ensured Node.js built-in modules are imported with the `node:` protocol.
    -   `lint/suspicious/noExplicitAny`: Replaced `any` type annotations with more specific types (`React.ReactNode`, `GetStaticPropsContext`, `unknown`) where appropriate.
    -   `lint/a11y/useSemanticElements`: Corrected semantic HTML usage (e.g., changing `div` with `role="button"` to `button`).
    -   `lint/a11y/noSvgWithoutTitle`: Added `title` elements to SVG icons for accessibility.
    -   `lint/a11y/noNoninteractiveTabindex`: Removed `tabIndex` from non-interactive elements.
    -   `lint/suspicious/noArrayIndexKey`: Replaced array index keys with stable, unique identifiers (e.g., `post.url`, `tag`) in mapped lists.
    -   `lint/security/noDangerouslySetInnerHtml`: Handled `dangerouslySetInnerHTML` by either disabling the rule for trusted content sources in `biome.json` or adding `// eslint-disable-next-line react/no-danger` comments where necessary.
    -   `lint/suspicious/noAssignInExpressions`: Refactored assignments within expressions to improve clarity.
    -   `lint/correctness/useUniqueElementIds`: Addressed static ID issues by either disabling the rule in `biome.json` for specific instances or adding `// eslint-disable-next-line` comments.
    -   `lint/correctness/useParseIntRadix`: Added radix parameter to `parseInt` calls.
    -   `lint/suspicious/noConfusingVoidType`: Corrected `void` in union types.
    -   `lint/correctness/noUnusedFunctionParameters`: Renamed unused function parameters with a leading underscore.
    -   `lint/complexity/noCommaOperator`: Removed comma operators from expressions.
    -   `lint/complexity/useOptionalChain`: Implemented optional chaining for safer property access.
-   **Improved Import Organization:** Ensured consistent import sorting across files.
-   **Biome Configuration Refinement:** Adjusted `biome.json` to correctly manage linting rules and formatting, including handling of Tailwind CSS and DaisyUI directives.

### Markdown Editing Features

-   **Code Syntax Highlighting:** Added support for code syntax highlighting in Markdown files using `rehype-highlight`.
-   **Linkable Headings:** Enabled automatic generation of `id` attributes for headings, making them linkable.
-   **Admonitions:** Added support for admonitions (notes, warnings, tips) in Markdown using `remark-admonitions`.

### Portfolio Page Improvements

-   **Enhanced Project Document Type:** Added `liveUrl` and `repoUrl` fields to the `Project` document type in `contentlayer.config.ts` to include links to live projects and source code.
-   **Improved Project Card Component:** Created a more visually appealing `ProjectCard` component to display projects, including a prominent image, title, description, technologies, and call-to-action buttons (translated to Spanish).
-   **Spanish Translation:** All visible text on the portfolio page, including titles and buttons, has been translated to Spanish.
-   **Call to Action:** Added a "Contáctame" button linking to the "sobre-el-autor" page.

### Homepage Improvements

-   **Modernized "Últimas Publicaciones" Section:** The "Últimas Publicaciones" (Latest Posts) section now uses an improved `PostCard` component with DaisyUI styling.
-   **Consistent Card Height:** Implemented a layout fix to ensure all post cards in a row have the same height, preventing empty spaces.

### Theme Switcher Fix

-   **Custom ThemeProvider:** Replaced the direct use of `theme-change` with a custom `ThemeProvider` using React's Context API for more robust theme management in Next.js.
-   **Corrected ThemeToggle:** The `ThemeToggle` component in `Header.tsx` now correctly uses the `useTheme` hook to toggle between "winter" and "night" themes.

### Component Organization

-   **Reverted Changes:** An attempt to reorganize the `components` directory into `common`, `posts`, `projects`, and `providers` subdirectories was reverted due to persistent import resolution errors. The component structure has been restored to its original state.

### Imgix Integration

-   **Integrated Imgix for Image Optimization:** Implemented Imgix for optimized image delivery across the blog.
    -   Configured `astro.config.mjs` to authorize `igcn-ws.imgix.net` as a remote image source for Astro's image optimization.
    -   Replaced custom `ImgxImage.astro` component with Astro's built-in `<Image />` component in Astro files (`pages/image-test.astro`, `components/PostCard.astro`, `components/ProjectCard.astro`, `layouts/PostLayout.astro`, `components/Footer.astro`).
    -   Created `src/utils/imgxUtils.ts` containing `generateImgxUrl` and `generateImgxSrcSet` functions to construct Imgix URLs.
    -   Updated Astro components to use `generateImgxUrl` for local image paths when passing them to Astro's `<Image />` component.
    -   Modified `components/ImageGallery.tsx` (a React component) to embed and use the `generateImgxUrl` and `generateImgxSrcSet` functions directly for Imgix-optimized images.
    -   Ensured external images in `components/Footer.astro` use standard `<img>` tags and are not processed by Imgix.
    -   Removed the need for the `PUBLIC_SITE_BASE_URL` environment variable.

## Important Memory Data

-   The blog's primary language is **Spanish**. All user-facing text should be in Spanish.
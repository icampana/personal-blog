# Copilot Instructions for AI Coding Agents

## Project Overview
- This is an Astro blog project using TypeScript, Tailwind CSS, and Astro's native content collections for content management.
- Content is stored in `src/content/` (posts, pages, projects). Blog posts use Markdown with frontmatter.
- Components are in `src/components/` (e.g., `PostCard.astro`, `SearchComponent.tsx`).
- Utility functions are in `src/utils/`.
- The site is styled with Tailwind (`tailwind.config.js`, `postcss.config.js`).
- Search functionality is implemented in `src/lib/search-index.js` and `src/pages/search.astro`.

## Developer Workflows
- **Start development:** `pnpm dev` or `npm run dev` (Astro dev server at `localhost:4321`).
- **Build for production:** `pnpm build` or `npm run build`.
- **Content updates:** Add/edit Markdown files in `src/content/posts/`, `src/content/pages/`, or `src/content/projects/`. Use frontmatter for metadata.
- **Frontmatter updates:** Use `update_frontmatter.py` for batch updates to Markdown frontmatter.
- **Deploy:** Project is configured for Netlify (`netlify.toml`).

## Key Patterns & Conventions
- **Content Collections:** Content is sourced from Markdown files and transformed for use in Astro components. See `src/content/config.ts`.
- **Component structure:** Prefer Astro components. Use props for data injection. Example: `PostCard.astro` receives post data as props.
- **Date formatting:** Use the `Date.astro` component for consistent date rendering.
- **Related posts:** Use `RelatedPosts.tsx` for cross-linking content.
- **Search:** Indexes are generated in `src/lib/search-index.js` and consumed in `src/pages/search.astro`.
- **Styling:** Use Tailwind utility classes. Global styles in `src/styles/globals.css`.
- **Metadata:** Site-wide metadata in `metadata.json`.

## Integration Points
- **Astro Content Collections:** Integrates Markdown content into Astro pages.
- **Netlify:** Deployment configuration in `netlify.toml`.
- **TinaCMS:** Configuration in `tina/` for content editing (if enabled).

## Examples
- To add a new blog post: create a Markdown file in `src/content/posts/` with frontmatter (`title`, `date`, `tags`, etc.).
- To add a new React block: create a file in `src/components/blocks/`, export a functional component, and import it where needed.
- To update search: ensure new content is indexed in `src/lib/search-index.js`.

## References
- `README.md`: Basic setup and dev instructions.
- `src/content/config.ts`: Content sourcing logic.
- `src/components/PostCard.astro`: Main blog post rendering logic.
- `src/lib/search-index.js`: Search index generation.
- `update_frontmatter.py`: Frontmatter batch update script.

---

If any section is unclear or missing, please provide feedback to improve these instructions.

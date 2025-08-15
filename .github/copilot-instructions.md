# Copilot Instructions for AI Coding Agents

## Project Overview
- This is a Next.js blog project using TypeScript, Tailwind CSS, and Contentlayer for content management.
- Content is stored in `content/` (posts, pages, assets). Blog posts use Markdown with frontmatter.
- Components are in `components/` and `components/blocks/` (e.g., `BlogPost.tsx`, `PostCard.tsx`).
- Utility functions are in `components/utils/`.
- The site is styled with Tailwind (`tailwind.config.js`, `postcss.config.js`).
- Search functionality is implemented in `lib/search-index.js` and `pages/search.tsx`.

## Developer Workflows
- **Start development:** `yarn dev` or `npm run dev` (Next.js dev server at `localhost:3000`).
- **Build for production:** `yarn build` or `npm run build`.
- **Content updates:** Add/edit Markdown files in `content/posts/` or `content/pages/`. Use frontmatter for metadata.
- **Frontmatter updates:** Use `update_frontmatter.py` for batch updates to Markdown frontmatter.
- **Deploy:** Project is configured for Vercel and Netlify (`netlify.toml`).

## Key Patterns & Conventions
- **Contentlayer:** Content is sourced from Markdown files and transformed for use in React components. See `contentlayer.config.ts`.
- **Component structure:** Prefer functional React components. Use props for data injection. Example: `BlogPost.tsx` receives post data as props.
- **Date formatting:** Use the `Date.tsx` block for consistent date rendering.
- **Related posts:** Use `RelatedPosts.tsx` for cross-linking content.
- **Search:** Indexes are generated in `lib/search-index.js` and consumed in `pages/search.tsx`.
- **Styling:** Use Tailwind utility classes. Global styles in `styles/globals.css`.
- **Metadata:** Site-wide metadata in `metadata.json`.

## Integration Points
- **Contentlayer:** Integrates Markdown content into Next.js pages.
- **Netlify/Vercel:** Deployment configuration in `netlify.toml` and Vercel settings.
- **TinaCMS:** Configuration in `tina/` for content editing (if enabled).

## Examples
- To add a new blog post: create a Markdown file in `content/posts/` with frontmatter (`title`, `date`, `tags`, etc.).
- To add a new React block: create a file in `components/blocks/`, export a functional component, and import it where needed.
- To update search: ensure new content is indexed in `lib/search-index.js`.

## References
- `README.md`: Basic setup and dev instructions.
- `contentlayer.config.ts`: Content sourcing logic.
- `components/blocks/BlogPost.tsx`: Main blog post rendering logic.
- `lib/search-index.js`: Search index generation.
- `update_frontmatter.py`: Frontmatter batch update script.

---

If any section is unclear or missing, please provide feedback to improve these instructions.

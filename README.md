
# Personal Blog (Next.js, TypeScript, Tailwind, Contentlayer)

## Overview
This is a Next.js blog project using TypeScript, Tailwind CSS, and Contentlayer for content management. Content is written in Markdown and stored in `content/`.

## Getting Started

1. **Install dependencies:**
	 ```bash
	 yarn install
	 # or
	 npm install
	 ```

2. **Start development server:**
	 ```bash
	 yarn dev
	 # or
	 npm run dev
	 ```
	 The app runs at [http://localhost:3000](http://localhost:3000).

## Content Management
- Add/edit Markdown files in `content/posts/` or `content/pages/`.
- Use frontmatter for metadata (`title`, `date`, `tags`, etc.).
- Batch update frontmatter with `update_frontmatter.py`.

## Key Files & Structure
- `components/blocks/BlogPost.tsx`: Main blog post rendering.
- `components/blocks/Date.tsx`: Consistent date formatting.
- `components/blocks/RelatedPosts.tsx`: Cross-linking related content.
- `components/utils/`: Utility functions for posts and text.
- `lib/search-index.js`: Search index generation.
- `pages/search.tsx`: Search UI.
- `contentlayer.config.ts`: Content sourcing logic.
- `metadata.json`: Site-wide metadata.
- `styles/globals.css`: Global Tailwind styles.

## Build & Deploy
- **Build for production:**
	```bash
	yarn build
	# or
	npm run build
	```
- **Deploy:**
	- Vercel: auto-detects Next.js
	- Netlify: see `netlify.toml`

## Search Functionality
- Search indexes are generated in `lib/search-index.js` and consumed in `pages/search.tsx`.

## Integration Points
- **Contentlayer:** Integrates Markdown content into Next.js pages.
- **TinaCMS:** Optional, see `tina/` for config.

## Examples
- Add a new post: create a Markdown file in `content/posts/` with frontmatter.
- Add a new block: create a file in `components/blocks/`, export a functional component, and import as needed.
- Update search: ensure new content is indexed in `lib/search-index.js`.

## References
- `.github/copilot-instructions.md`: AI agent instructions
- `README.md`: This file
- `contentlayer.config.ts`: Content sourcing
- `update_frontmatter.py`: Frontmatter batch update

---
For questions or improvements, see `.github/copilot-instructions.md` or open an issue.

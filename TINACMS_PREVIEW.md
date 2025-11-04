# TinaCMS Preview Feature

This document explains how to use the TinaCMS preview functionality that has been added to the blog.

## What's Been Added

### 1. Preview Component (`src/components/TinaPreview.tsx`)
A React component that renders live previews of your content as you edit it in TinaCMS. It supports:
- Blog posts with featured images, tags, and descriptions
- Static pages
- Portfolio projects with galleries and tech stacks

### 2. Preview Page (`src/pages/preview.astro`)
A dedicated preview route that TinaCMS can use to display content in an iframe.

### 3. Route Mapping Configuration (Development Only)
The TinaCMS config (`tina/config.ts`) now includes:
- `RouteMappingPlugin`: Maps content to their actual URLs (development mode only)
- Preview URL configuration for all content types
- **Note**: The route mapping plugin is only enabled in development mode to avoid schema validation issues in production builds

## How to Use

### Option 1: View on Site (Recommended)
This is the simplest way to preview your content:

1. Open TinaCMS admin at `http://localhost:4321/admin`
2. Navigate to Posts, Pages, or Projects
3. Click on any content item to edit it
4. Look for the "View on Site" or "Go to Page" button in the top-right corner
5. Click it to open the actual rendered page in a new tab
6. Make changes in the editor and save to see them on the site

**Benefits:**
- See the exact rendered output with all styling
- Full page context with navigation, footer, etc.
- Works with all Astro features (SSR, routing, etc.)

### Option 2: Custom Preview Route
For a side-by-side preview experience:

1. Open TinaCMS admin at `http://localhost:4321/admin`
2. Edit any content (post, page, or project)
3. Open `/preview` in a separate browser window or panel
4. Position windows side-by-side for a split-screen experience

**Note:** The `/preview` route listens for TinaCMS messages and updates in real-time, but requires manual window positioning.

## Content Type Previews

### Posts
Preview includes:
- Featured image (if set)
- Title and description
- Publication date and reading time estimate
- Tags with badge styling
- Full markdown content with syntax highlighting

### Pages
Preview includes:
- Title and description
- Publication date
- Full markdown content

### Projects
Preview includes:
- Gallery images
- Title and description
- Tech stack badges
- Live URL and repository links
- Full markdown content

## URL Mapping

The preview system maps content to these URLs:

- **Posts**: `/posts/{filename}` (e.g., `/posts/2024-11-my-post-title`)
- **Pages**: `/{filename}` (e.g., `/about`)
- **Projects**: `/portafolio/{filename}` (e.g., `/portafolio/my-project`)

## Technical Details

### Route Mapping Plugin (Development Mode Only)
The `RouteMappingPlugin` in `tina/config.ts` is conditionally loaded only in development mode:
- Extracts slugs from filenames
- Maps collections to their respective URL patterns
- Provides the "View on Site" button in the TinaCMS admin
- **Production Note**: The plugin is disabled in production builds to prevent TinaCMS Cloud schema validation conflicts

### Preview Component
The `TinaPreview` component:
- Uses TinaCMS's `useTina` hook for live data updates
- Renders content based on collection type
- Applies the same styling as the actual site
- Handles image paths correctly (from `/photos/`)

## Development

### Running with Preview
```bash
# Start dev server with TinaCMS
pnpm run dev
```

This starts both:
- Astro dev server on `http://localhost:4321`
- TinaCMS admin on `http://localhost:4321/admin`

### Building for Production
```bash
# Production build (includes TinaCMS build)
pnpm run build
```

The preview functionality works in both development and production environments.

## Troubleshooting

### Preview Not Updating
- Make sure you've saved your changes in TinaCMS
- Refresh the preview page
- Check the browser console for errors

### Images Not Showing
- Ensure images are in the `public/photos/` directory
- Check that the `featuredImage` or `galleryImage` paths are correct
- Images should be relative to the `photos` folder (e.g., `2024/my-image.jpg`)

### "View on Site" Button Not Appearing
- The "View on Site" button only appears in development mode (when `NODE_ENV=development`)
- Make sure you're running `pnpm run dev` (not production build)
- Check that the content has been saved at least once
- Verify the route exists in Astro (check the dev server logs)

### Production Build Failing with Schema Mismatch
- This should not happen anymore as the `cmsCallback` is only enabled in development
- If it does occur, ensure your `NODE_ENV` is not set to `development` during production builds
- The preview functionality (preview page and component) still works in production, just without the "View on Site" button convenience

## Future Enhancements

Possible improvements to the preview system:

1. **Iframe Preview in Admin**: Configure TinaCMS to show an embedded iframe preview panel
2. **Live Markdown Rendering**: Add real-time markdown-to-HTML conversion with remark/rehype plugins
3. **Mobile Preview**: Add responsive preview modes (desktop, tablet, mobile)
4. **Preview with Context**: Show related posts, navigation, and footer in preview
5. **Dark Mode Preview**: Toggle theme preview between light and dark modes

## Additional Resources

- [TinaCMS Documentation](https://tina.io/docs/)
- [TinaCMS Visual Editing](https://tina.io/docs/contextual-editing/overview/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)

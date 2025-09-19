# TinaCMS Setup for Astro Blog

This document explains how to set up and use TinaCMS with the Astro blog.

## Prerequisites

1. Node.js and pnpm installed
2. Git repository set up
3. TinaCMS account (optional for local development)

## Installation

The TinaCMS dependencies are already included in the project. If you need to install them manually:

```bash
pnpm add tinacms @tinacms/cli
```

## Configuration

### 1. Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Update the values as needed:
- `TINA_CLIENT_ID` and `TINA_TOKEN` are for TinaCMS cloud (optional for local dev)
- `SITE_URL` should match your production URL

### 2. TinaCMS Configuration

The TinaCMS configuration is located in `tina/config.ts`. It includes:

- **Posts Collection**: Blog posts in `src/content/posts/`
- **Pages Collection**: Static pages in `src/content/pages/`
- **Projects Collection**: Portfolio projects in `src/content/projects/`

## Development

### Start Development Server

```bash
pnpm dev
```

This will start both Astro and TinaCMS in development mode.

### Access TinaCMS Admin

1. **Local Admin**: Visit `http://localhost:4321/admin`
2. **Edit Mode**: Add `?tina-edit=1` to any page URL to enable inline editing

### TinaCMS Only

To run only TinaCMS (useful for content editing):

```bash
pnpm tina:dev
```

## Content Management

### Creating New Content

1. Go to `/admin` in your browser
2. Select the collection (Posts, Pages, or Projects)
3. Click "Create New"
4. Fill in the fields and save

### Editing Existing Content

1. Navigate to any page on your site
2. Add `?tina-edit=1` to the URL
3. Click on editable content to modify it
4. Or use the admin interface at `/admin`

### Content Structure

#### Posts
- **Title**: Article title
- **Date**: Publication date
- **Featured Image**: Hero image for the post
- **Description**: Short description for SEO and previews
- **Tags**: Array of tags for categorization
- **Body**: Markdown content

#### Pages
- **Title**: Page title
- **Date**: Creation/update date
- **Description**: Page description
- **Body**: Markdown content

#### Projects
- **Title**: Project name
- **Date**: Project date
- **Description**: Project description
- **Gallery Images**: Array of project images
- **Tech Stack**: Technologies used
- **Live URL**: Link to live project
- **Repository URL**: Link to source code
- **Body**: Detailed project description

## Build Process

### Production Build

```bash
pnpm build
```

This will:
1. Build TinaCMS admin interface
2. Generate search index
3. Build Astro site

### TinaCMS Build Only

```bash
pnpm tina:build
```

## Deployment

### Netlify/Vercel

1. Set environment variables in your hosting platform
2. The build command should be: `pnpm build`
3. The publish directory should be: `dist`

### TinaCMS Cloud (Optional)

For collaborative editing and media management:

1. Sign up at [tina.io](https://tina.io)
2. Create a new project
3. Update `TINA_CLIENT_ID` and `TINA_TOKEN` in your environment variables
4. Deploy your site

## Troubleshooting

### Common Issues

1. **Admin page not loading**: Make sure TinaCMS build completed successfully
2. **Content not updating**: Check that file paths in `tina/config.ts` match your content structure
3. **Build errors**: Ensure all required fields are present in your content files

### File Permissions

Make sure TinaCMS has write permissions to the content directories:
- `src/content/posts/`
- `src/content/pages/`
- `src/content/projects/`

### Git Integration

TinaCMS works best with Git. Make sure:
- Your content is committed to Git
- You have proper branch protection rules if using TinaCMS Cloud
- File changes are properly tracked

## Customization

### Adding New Fields

Edit `tina/templates.ts` to add new fields to your content types:

```typescript
{
  type: "string",
  name: "newField",
  label: "New Field",
  required: false,
}
```

### Custom Components

You can create custom TinaCMS components for specialized editing needs. See the [TinaCMS documentation](https://tina.io/docs/) for more details.

## Support

- [TinaCMS Documentation](https://tina.io/docs/)
- [Astro Documentation](https://docs.astro.build/)
- [GitHub Issues](https://github.com/tinacms/tinacms/issues) for TinaCMS bugs
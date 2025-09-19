# Content Migration Guide

This document outlines the content migration process from the Next.js blog to the Astro blog.

## Overview

The content migration involves:
- Migrating markdown files from Next.js format to Astro content collections
- Transforming frontmatter to match Astro schemas
- Converting image paths and references
- Validating all migrated content
- Testing content rendering

## Migration Scripts

### 1. Content Migration (`migrate:content`)
```bash
pnpm run migrate:content
```

**Purpose**: Migrates content from the parent Next.js blog to Astro format.

**What it does**:
- Copies markdown files from `../content/` to `src/content/`
- Transforms frontmatter to match Astro content collection schemas
- Converts image paths from relative to absolute
- Transforms internal links to use Astro routing
- Migrates images from `../public/photos/` to `public/photos/`

**Transformations Applied**:
- Date format: ISO strings → YYYY-MM-DD
- Categories → Tags (for posts)
- Image paths: `./image.jpg` → `/photos/image.jpg`
- Internal links: `/posts/slug` → `/posts/slug`
- Removes Next.js specific fields (layout, wordpress_id, etc.)

### 2. Content Validation (`validate:content`)
```bash
pnpm run validate:content
```

**Purpose**: Validates all content against Astro content collection schemas.

**What it checks**:
- **Frontmatter validation**: Required fields, data types, format
- **Image references**: Checks if referenced images exist
- **Internal links**: Validates internal link targets
- **Duplicate detection**: Finds posts with duplicate titles
- **Content structure**: Ensures proper markdown structure

**Validation Rules**:
- Posts: Must have `title`, `date`, optional `tags` (array), `featuredImage`
- Pages: Must have `title`, `date`, optional `path`
- Projects: Must have `title`, `date`, `description`, optional `techStack` (array), `galleryImage` (array)

### 3. Content Rendering Tests (`test:content`)
```bash
pnpm run test:content
```

**Purpose**: Tests that all content can be rendered without errors.

**What it tests**:
- **Markdown parsing**: Ensures all files can be parsed
- **URL generation**: Tests slug and path generation
- **Type-specific requirements**: Validates content type rules
- **Search index compatibility**: Ensures content works with search
- **Rendering compatibility**: Checks for common rendering issues

## Content Structure

### Posts (`src/content/posts/`)
```yaml
---
title: "Post Title"
date: 2023-01-15
description: "Optional description"
featuredImage: "/photos/image.jpg"
tags: ["tag1", "tag2"]
path: "/custom/path" # Optional
---

Post content in markdown...
```

### Pages (`src/content/pages/`)
```yaml
---
title: "Page Title"
date: 2023-01-15
description: "Optional description"
path: "/custom/path" # Optional
---

Page content in markdown...
```

### Projects (`src/content/projects/`)
```yaml
---
title: "Project Title"
date: 2023-01-15
description: "Project description"
techStack: ["React", "TypeScript"]
galleryImage: ["/photos/project1.jpg", "/photos/project2.jpg"]
liveUrl: "https://example.com"
repoUrl: "https://github.com/user/repo"
---

Project content in markdown...
```

## Image Migration

### Source Structure
```
../public/photos/
├── 2023/
│   ├── image1.jpg
│   └── image2.png
└── projects/
    └── project-image.jpg
```

### Target Structure
```
public/photos/
├── 2023/
│   ├── image1.jpg
│   └── image2.png
└── projects/
    └── project-image.jpg
```

### Image Path Transformations
- `./image.jpg` → `/photos/image.jpg`
- `../public/photos/image.jpg` → `/photos/image.jpg`
- `photos/image.jpg` → `/photos/image.jpg`

## URL Migration

### Post URLs
- Next.js: `/posts/slug` or custom path
- Astro: `/posts/slug` or `/posts/custom/path`

### Page URLs
- Next.js: `/slug` or custom path
- Astro: `/content/slug` or `/content/custom/path`

### Project URLs
- Next.js: `/projects/slug` or custom path
- Astro: `/portafolio/slug` or `/portafolio/custom/path`

## Migration Workflow

### 1. Pre-Migration Checks
```bash
# Ensure parent content exists
ls -la ../content/

# Check current Astro content
ls -la src/content/
```

### 2. Run Migration
```bash
# Migrate all content
pnpm run migrate:content

# Check migration results
pnpm run validate:content
```

### 3. Post-Migration Validation
```bash
# Test content rendering
pnpm run test:content

# Build and verify
pnpm run build
pnpm run build:verify
```

### 4. Manual Review
- Review migration statistics
- Check for any failed migrations
- Verify image references
- Test sample posts in development

## Common Issues and Solutions

### 1. Date Format Issues
**Problem**: Invalid date formats in frontmatter
**Solution**:
```bash
# Run frontmatter fix script
pnpm run fix:frontmatter
```

### 2. Missing Images
**Problem**: Referenced images not found
**Solutions**:
- Check image paths in content
- Verify images exist in `public/photos/`
- Update image references manually if needed

### 3. Broken Internal Links
**Problem**: Links to non-existent content
**Solutions**:
- Update links to use new Astro routing
- Remove or fix broken references
- Use absolute paths for internal links

### 4. Frontmatter Schema Errors
**Problem**: Frontmatter doesn't match Astro schemas
**Solutions**:
- Update content collection schemas if needed
- Fix frontmatter in problematic files
- Remove unsupported fields

## Content Statistics

After migration, you should see statistics like:

```
📊 Content Statistics:
========================================
Posts:
  Total: 350
  Valid: 348
  Errors: 2

Pages:
  Total: 5
  Valid: 5
  Errors: 0

Projects:
  Total: 6
  Valid: 6
  Errors: 0

Images:
  Total: 150
  Missing: 2
  Valid: 148
```

## Validation Checklist

- [ ] All posts have valid frontmatter
- [ ] All pages have valid frontmatter
- [ ] All projects have valid frontmatter
- [ ] No missing images
- [ ] No broken internal links
- [ ] No duplicate titles
- [ ] All content renders without errors
- [ ] Search index generates successfully
- [ ] Build completes without errors

## Troubleshooting

### Migration Script Fails
1. Check source directory exists: `../content/`
2. Verify permissions on target directories
3. Check for file naming conflicts
4. Review error messages for specific issues

### Validation Fails
1. Run validation with detailed output
2. Fix frontmatter issues in reported files
3. Update missing images or fix references
4. Re-run validation after fixes

### Build Fails After Migration
1. Check Astro content collection schemas
2. Verify all required fields are present
3. Test with a subset of content first
4. Check for TypeScript errors

## Performance Considerations

### Large Content Sets
- Migration processes files in batches
- Validation includes progress indicators
- Build verification checks critical files only
- Search index generation is optimized

### Memory Usage
- Scripts process files individually to minimize memory usage
- Large images are copied, not loaded into memory
- Validation results are streamed to avoid memory issues

## Rollback Procedure

If migration issues occur:

1. **Backup Current State**:
   ```bash
   cp -r src/content src/content.backup
   ```

2. **Restore Previous State**:
   ```bash
   rm -rf src/content
   mv src/content.backup src/content
   ```

3. **Clean Migration**:
   ```bash
   # Remove migrated content
   rm -rf src/content/posts/*
   rm -rf src/content/pages/*
   rm -rf src/content/projects/*

   # Re-run migration
   pnpm run migrate:content
   ```

## Post-Migration Tasks

1. **Update Search Index**:
   ```bash
   pnpm run build:index
   ```

2. **Test Build**:
   ```bash
   pnpm run build
   ```

3. **Verify Deployment**:
   ```bash
   pnpm run deploy:preview
   ```

4. **Update Documentation**:
   - Update any references to old URLs
   - Update internal documentation
   - Notify team of new structure

## Support

For migration issues:
1. Check migration logs for specific errors
2. Review validation output for detailed issues
3. Test with a small subset of content first
4. Consult Astro content collections documentation
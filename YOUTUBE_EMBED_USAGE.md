# YouTube Embedding in Markdown

This document explains how to embed YouTube videos in your markdown blog posts.

## Supported Formats

### 1. Automatic URL Detection (Simplest)

Just paste a YouTube URL on its own line and it will automatically be converted to an embedded player:

```markdown
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

This also works with short URLs:

```markdown
https://youtu.be/dQw4w9WgXcQ
```

### 2. Custom Directive Syntax (More Control)

Use the `::youtube` directive for more explicit control:

#### Using Video ID:
```markdown
::youtube[dQw4w9WgXcQ]
```

#### Using attribute syntax:
```markdown
::youtube{v=dQw4w9WgXcQ}
```

#### With custom title (for accessibility):
```markdown
::youtube{v=dQw4w9WgXcQ title="Never Gonna Give You Up"}
```

## Features

- **Privacy-focused**: Uses `youtube-nocookie.com` domain for better privacy
- **Responsive**: Videos automatically scale to fit the container (16:9 aspect ratio)
- **Lazy loading**: Videos are loaded only when needed
- **Accessible**: Proper iframe titles for screen readers
- **SEO-friendly**: Proper HTML structure with semantic markup

## Example in a Blog Post

```markdown
---
title: "My Favorite Tech Videos"
date: 2024-01-15
---

# My Favorite Tech Videos

Check out this amazing talk about web performance:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

Or use the directive syntax:

::youtube{v=dQw4w9WgXcQ title="Web Performance Talk"}

You can write more content here...
```

## Technical Details

- Video embeds are responsive with a 16:9 aspect ratio (56.25% padding-bottom)
- 2rem margin above and below for proper spacing
- Uses modern YouTube privacy-enhanced mode
- Supports all standard YouTube iframe features (fullscreen, picture-in-picture, etc.)

## Testing

To test the embedding:

1. Create a new blog post in `src/content/posts/`
2. Add a YouTube URL or directive
3. Run `pnpm run dev`
4. Navigate to your post to see the embedded video

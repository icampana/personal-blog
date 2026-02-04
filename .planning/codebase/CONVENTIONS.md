# Coding Conventions

**Analysis Date:** 2026-02-04

## Naming Patterns

**Files:**
- Components: `PascalCase.tsx` (e.g., `SearchComponent.tsx`, `ImageGallery.tsx`)
- Utilities: `camelCase.ts` (e.g., `client.ts`, `imageUtils.ts`, `imgxUtils.ts`)
- Astro layouts: `PascalCase.astro` (e.g., `BaseLayout.astro`, `PostLayout.astro`)
- Astro pages: `kebab-case.astro` (e.g., `index.astro`, `search.astro`)
- Test files: `*.test.ts` or `*.test.tsx` (e.g., `utils.test.ts`, `SearchComponent.test.tsx`)

**Functions:**
- `camelCase` (e.g., `formatDate`, `getPostUrl`, `getReadingTime`, `generateImgxUrl`)
- Handler functions: `handle*` pattern (e.g., `handleToggle`, `handleSubmit`, `handleKeyDown`)
- Event handlers: `on*` pattern in JSX (e.g., `onClick`, `onSubmit`, `onKeyDown`)

**Variables:**
- Local variables: `camelCase` (e.g., `searchQuery`, `isLightboxOpen`, `isLoading`)
- State variables: `is*` prefix for booleans, `current*` for tracking state (e.g., `isVisible`, `currentIndex`)
- React state: descriptive names paired with setters (e.g., `const [showBanner, setShowBanner]`)

**Types:**
- Interfaces: `PascalCase` (e.g., `SearchItem`, `ImageSizes`, `ShareButtonsProps`)
- Type aliases: `PascalCase` (e.g., `ConsentPreferences`)
- Component props: `<ComponentName>Props` pattern (e.g., `ImageGalleryProps`)

**Constants:**
- `UPPER_SNAKE_CASE` for module-level constants (e.g., `CONSENT_KEY`, `DEFAULT_IMAGE_SIZES`)
- `PascalCase` for config objects (e.g., `mockSearchData`, `themeConfig`)

## Code Style

**Formatting:**
- **Tool:** Biome 2.3.5 (replaces ESLint + Prettier)
- **Indentation:** Spaces (2 spaces)
- **Quotes:** Single quotes for JavaScript/TypeScript (`'string'`)
- **Semicolons:** Required
- **Config file:** `biome.json`

**Linting:**
- **Tool:** Biome 2.3.5
- **Key rules:**
  - `useImportType`: Enforces `import type` for type-only imports
  - `noUnusedVariables`: Error-level detection of unused variables
- **Ignored files:**
  - Astro components (`src/**/*.astro`)
  - Scripts directory (`scripts/`)
  - Generated directories (`.astro/`, `dist/`, `coverage/`, `tina/__generated__/`)
  - Global styles (`src/styles/globals.css`)

**TypeScript:**
- Strict mode enabled via `astro/tsconfigs/strict`
- All functions and components typed with TypeScript
- `export interface` for component props
- `export type` for type aliases

## Import Organization

**Order:**
1. React/TypeScript imports (e.g., `import React, { useState } from 'react'`)
2. Third-party library imports (e.g., `import { Document } from 'flexsearch'`)
3. Astro/internal imports (e.g., `import { getCollection } from 'astro:content'`)
4. Internal absolute imports (e.g., `import { formatDate } from '../utils/client'`)
5. Relative imports from same directory (e.g., `import Component from './Component'`)

**Path Aliases:**
- `@/` → `/src`
- `@/components` → `/src/components`
- `@/utils` → `/src/utils`
- `@/lib` → `/src/lib`

**Import Type:**
- Type-only imports use `import type` (enforced by Biome):
  ```typescript
  import type React from 'react';
  import type { CollectionEntry } from 'astro:content';
  import type { ImageSizes } from './types';
  ```

**Grouping:**
- Related imports grouped together
- Blank lines between major import groups
- No unused imports (enforced by linter)

## Error Handling

**Patterns:**
- **Try/catch for async operations:** Always wrap `fetch`, `navigator.clipboard`, and other browser APIs
- **Console.error for logging:** Use `console.error()` to log errors with context
- **Fallback implementations:** Provide fallbacks for older browsers (e.g., `document.execCommand('copy')` as fallback)

**Example (CopyToClipboard.tsx):**
```typescript
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    // ... fallback implementation
  }
};
```

**Example (SearchResults.tsx):**
```typescript
async function fetchSearchIndex() {
  try {
    const response = await fetch('/search-index.json');
    const data = await response.json();
    // ... process data
  } catch (error) {
    console.error('Error loading search index:', error);
  }
}
```

**Silent failures:**
- No `throw` for user-facing errors (log instead)
- Graceful degradation (e.g., show empty state if search fails)
- No `alert()` or other blocking popups

## Logging

**Framework:** `console.error` only

**Patterns:**
- **Error logging:** `console.error('Context:', error)` - always include context
- **No console.log:** Not used in production code
- **No console.warn:** Not used in production code

**When to log:**
- When catching exceptions in try/catch blocks
- When async operations fail (fetch, API calls)
- When expected functionality doesn't work (e.g., image preload fails)

**Examples:**
```typescript
console.error('Error loading search index:', error);
console.error('Error preloading images:', error);
console.error('Error sharing:', err);
```

## Comments

**When to Comment:**
- Complex algorithms (e.g., YouTube ID extraction in `remark-youtube.js`)
- Public API documentation (JSDoc for library functions)
- Migration/legacy notes (e.g., "Legacy fields from WordPress/Blogger migration")
- Configuration placeholders (e.g., "This will be implemented in task 7")
- Non-obvious business logic

**JSDoc/TSDoc:**
- Used for public functions in utility libraries
- Includes parameter types and return types even when TypeScript provides them
- Example (`remark-youtube.js`):
  ```javascript
  /**
   * Extract YouTube video ID from various URL formats
   * @param {string} url - The URL to extract from
   * @returns {string|null} - The video ID or null if not found
   */
  function extractYouTubeId(url) {
    // ...
  }
  ```

**Inline comments:**
- Used sparingly for non-obvious logic
- Explain WHY, not WHAT
- Example (`ConsentBanner.tsx`):
  ```typescript
  // Get current search query from URL if we're on the search page
  if (typeof window !== 'undefined') {
    // ... implementation
  }
  ```

**No TODO/FIXME comments:**
- Codebase is clean of TODO/FIXME/HACK/XXX markers
- Issues tracked via Git and documentation

## Function Design

**Size:**
- Utility functions: Typically 5-30 lines (e.g., `formatDate`, `getPostUrl`)
- React components: 50-300 lines (larger components include complex state management)
- Event handlers: 5-20 lines
- No strict line limit, but aim for single responsibility

**Parameters:**
- Use default parameters for optional values:
  ```typescript
  export function generateImgxUrl(
    originalSrc: string,
    width: number,
    height?: number,
    quality: number = 80,
    format: string = 'auto',
    skipCrop: boolean = false,
  ): string
  ```
- Destructure complex parameters in functions:
  ```typescript
  function generateSizes(breakpoints: { [key: string]: string }): string
  ```
- Props interfaces for React components:
  ```typescript
  interface ShareButtonsProps {
    url: string;
    title: string;
    description?: string;
  }
  ```

**Return Values:**
- Typed explicitly with TypeScript
- Union types for multiple possibilities (e.g., `string | null`, `SearchResult[] | null`)
- Consistent shape for similar functions (e.g., all URL generators return strings)
- Return early for validation failures (e.g., empty paths return placeholder)

**Examples:**
```typescript
// Simple function with early return
export function normalizeImagePath(imagePath?: string): string {
  if (!imagePath) return '/images/placeholder.svg';

  // Handle external URLs
  if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
    return imagePath;
  }

  // ... continue processing
  return imagePath;
}

// Async function with error handling
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
    // Fallback implementation
  }
};
```

## Module Design

**Exports:**
- **Named exports** for utility functions (e.g., `export function formatDate()`)
- **Default exports** for React components and Astro components (e.g., `export default function ThemeToggle()`)
- **Named exports** for constants and types (e.g., `export interface SearchItem`, `export const DEFAULT_IMAGE_SIZES`)
- **Barrel files** not used - imports are explicit

**Utility modules:**
- `src/utils/client.ts`: Client-side utilities (URL generation, date formatting, tag functions)
- `src/utils/index.ts`: Server-side utilities (reading time, summary generation)
- `src/utils/imageUtils.ts`: Image path normalization and optimization helpers
- `src/utils/imgxUtils.ts`: Imgix CDN URL generation

**Component modules:**
- Each component in its own file
- Default export for the component
- Type interfaces defined in the same file

**Pattern examples:**

**Named exports (utilities):**
```typescript
// src/utils/client.ts
export function formatDate(date: Date): string { ... }
export function getPostUrl(post: CollectionEntry<'posts'>): string { ... }
export function getAllTags(posts: CollectionEntry<'posts'>[]): string[] { ... }
```

**Default export (component):**
```typescript
// src/components/SearchComponent.tsx
const SearchComponent: React.FC = () => { ... }
export default SearchComponent;
```

**Type exports:**
```typescript
// src/lib/search-index.ts
export interface SearchItem {
  title: string;
  url: string;
  content: string;
  summary: string;
  tags?: string[];
  date: string;
  type: 'post' | 'page' | 'project';
}
```

## React Patterns

**Component structure:**
- Functional components with hooks (no class components)
- TypeScript interfaces for props
- `React.FC` type for components without props
- Explicit return type inference for function components

**Hook usage:**
- `useState` for local state
- `useEffect` for side effects and lifecycle
- `useCallback` for event handlers (performance optimization)
- `useRef` for DOM references
- `useTina` from TinaCMS for CMS integration

**State management:**
- Local component state via `useState`
- No global state management (Redux, Zustand, etc.)
- Props drilling for passing data
- Custom hooks not used (could be added for complex logic)

**Event handling:**
- Inline arrow functions for simple handlers: `onClick={() => setIsOpen(!isOpen)}`
- Named functions for complex handlers to avoid re-renders
- Type-safe event handlers: `React.FormEvent`, `React.KeyboardEvent`, `React.MouseEvent`

**Example:**
```typescript
const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title, lazy = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Optimized event handler with useCallback
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  }, []);

  // Inline handler for simple toggle
  return <button onClick={() => setIsLightboxOpen(true)}>Open</button>;
};
```

---

*Convention analysis: 2026-02-04*

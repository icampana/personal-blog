# Testing Patterns

**Analysis Date:** 2026-02-04

## Test Framework

**Runner:**
- Vitest 4.0.8
- Config: `vitest.config.ts`

**Environment:**
- jsdom (for React component testing)
- Globals enabled (describe, it, expect available globally)
- CSS enabled for component styling tests

**Setup file:**
- `src/test/setup.ts` - Sets up mocks for Astro globals and external libraries

**Assertion Library:**
- Built-in Vitest assertions (expect, toBe, toContain, etc.)
- `@testing-library/jest-dom` for DOM assertions (toBeInTheDocument, toHaveAttribute, etc.)

**Run Commands:**
```bash
pnpm run test           # Run all tests in watch mode
pnpm run test:run       # Run tests once (used in CI)
pnpm run test:ui        # Run tests with UI interface
pnpm run test:coverage  # Run tests with coverage report
```

**Configuration details:**
```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/utils': '/src/utils',
      '@/lib': '/src/lib',
    },
  },
});
```

## Test File Organization

**Location:**
- Tests co-located in `src/test/` directory (not next to source files)
- Organized by type: `components/`, `integration/`, and top-level utility tests

**Naming:**
- `*.test.ts` for TypeScript utility tests (e.g., `utils.test.ts`, `imageUtils.test.ts`)
- `*.test.tsx` for React component tests (e.g., `SearchComponent.test.tsx`, `ImageGallery.test.tsx`)

**Structure:**
```
src/test/
├── setup.ts                    # Global test setup and mocks
├── components/                 # React component tests
│   ├── SearchComponent.test.tsx
│   └── ImageGallery.test.tsx
├── integration/                # Integration tests
│   ├── content.test.ts
│   ├── routes.test.ts
│   └── search.test.ts
├── utils.test.ts              # Utility function tests
└── imageUtils.test.ts         # Image utility tests
```

**README:**
- `src/test/README.md` documents test structure, coverage goals, and guidelines

## Test Structure

**Suite Organization:**
```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Component from '../Component';

describe('ComponentName', () => {
  beforeEach(() => {
    // Reset or setup before each test
    vi.clearAllMocks();
  });

  it('should do something expected', () => {
    // Arrange
    render(<Component prop="value" />);

    // Act
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Assert
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  describe('Specific Feature', () => {
    it('should handle edge case', () => {
      // Test specific scenario
    });
  });
});
```

**Patterns:**
- **Setup pattern:** `beforeEach()` used for resetting mocks and initial state
- **Teardown pattern:** Not needed - Vitest handles cleanup automatically
- **Assertion pattern:** Arrange/Act/Assert with descriptive test names
- **Nested describes:** Used for grouping related tests by feature

**Example from SearchComponent.test.tsx:**
```typescript
describe('SearchComponent', () => {
  beforeEach(() => {
    // Mock window.location with proper initial state
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:3000/',
        pathname: '/',
        search: '',
        assign: vi.fn(),
      },
    });
  });

  it('should render the search icon initially', () => {
    render(<SearchComponent />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/buscar/i)).not.toBeInTheDocument();
  });

  it('should show the search input when the icon is clicked', () => {
    render(<SearchComponent />);
    const searchIcon = screen.getByTestId('search-icon');
    fireEvent.click(searchIcon);
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
  });
});
```

## Mocking

**Framework:** Built-in Vitest mocking (`vi.mock`, `vi.fn`)

**Patterns:**
- **Mock external libraries** in setup.ts:
  ```typescript
  // src/test/setup.ts
  vi.mock('theme-change', () => ({
    themeChange: vi.fn(),
  }));

  vi.mock('reading-time', () => ({
    default: vi.fn(() => ({ minutes: 5, text: '5 min read' })),
  }));

  vi.mock('astro:content', () => ({
    getCollection: vi.fn(async (collection) => {
      if (collection === 'posts') {
        return [/* mock posts */];
      }
      return [];
    }),
  }));
  ```

- **Mock browser APIs** in beforeEach:
  ```typescript
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:3000/',
        pathname: '/',
        assign: vi.fn(),
      },
    });
  });
  ```

- **Mock global constructors**:
  ```typescript
  // Mock Image constructor for image loading tests
  global.Image = class {
    onload: (() => void) | null = null;
    src: string = '';
    constructor() {
      setTimeout(() => {
        if (this.onload) {
          this.onload();
        }
      }, 100);
    }
  } as any;
  ```

**What to Mock:**
- External libraries (theme-change, reading-time)
- Astro globals (getCollection, Astro.url, etc.)
- Browser APIs (window.location, navigator.clipboard, Image constructor)
- Network requests (fetch) - use mock data instead

**What NOT to Mock:**
- Component internal state
- Utility functions under test
- DOM elements rendered by components
- React hooks (useEffect, useState, etc.)

**Mock data:**
- Defined inline or in test files
- Matches production data structure
- Realistic examples that edge cases

## Fixtures and Factories

**Test Data:**
```typescript
// Inline mock data
const mockSearchData = [
  {
    id: 0,
    title: 'Domina React: Patrones de Diseño',
    url: '/posts/react-patterns',
    content: 'Si eres programador...',
    summary: 'Descubre los Patrones de Diseño...',
    tags: ['React', 'Development', 'Frontend'],
    date: '2023-10-23T00:00:00.000Z',
    type: 'post',
  },
  // ... more items
];
```

**Mock data in setup.ts:**
```typescript
// src/test/setup.ts
vi.mock('astro:content', () => ({
  getCollection: vi.fn(async (collection) => {
    if (collection === 'posts') {
      return [
        {
          id: 'test-post-1.md',
          slug: 'test-post-1',
          body: 'This is a test post about JavaScript',
          collection: 'posts',
          data: {
            title: 'Test Post 1',
            date: new Date('2023-01-15'),
            description: 'A test post about JavaScript',
            tags: ['javascript', 'test'],
            featuredImage: '/images/test.jpg',
          },
        },
      ];
    }
    return [];
  }),
}));
```

**Location:**
- Mock data defined inline in test files for test-specific data
- Reusable mocks (Astro collections, common entities) in `src/test/setup.ts`
- No separate fixture files

## Coverage

**Requirements:** No strict enforcement, but goals documented in `src/test/README.md`

**Goals:**
- Utility Functions: 100% coverage
- React Components: 90%+ coverage
- Integration Tests: Cover all major user flows
- URL Compatibility: Test all legacy URL redirects

**View Coverage:**
```bash
pnpm run test:coverage
```

**Coverage directory:**
- Generated in `coverage/` directory
- HTML report available at `coverage/index.html`

**Tracked in build:**
- Tests run as part of prebuild: `pnpm run prebuild` runs `pnpm run test:run`
- Tests must pass before production build

## Test Types

**Unit Tests:**
- **Scope:** Individual utility functions and pure functions
- **Location:** Top of `src/test/` directory
- **Framework:** Vitest
- **No DOM:** Test pure functions without rendering
- **Examples:**
  - `utils.test.ts` - Date formatting, URL generation, tag functions
  - `imageUtils.test.ts` - Image path normalization, format detection

**Example (utils.test.ts):**
```typescript
describe('formatDate', () => {
  it('should format date correctly in Spanish', () => {
    const date = new Date('2023-01-15');
    const formatted = formatDate(date);
    expect(formatted).toMatch(/15 de enero de 2023/i);
  });

  it('should handle different months', () => {
    const date = new Date('2023-12-25');
    const formatted = formatDate(date);
    expect(formatted).toMatch(/25 de diciembre de 2023/i);
  });
});
```

**Integration Tests:**
- **Scope:** Content collection processing, search functionality, routing
- **Location:** `src/test/integration/` directory
- **Framework:** Vitest
- **Mocked dependencies:** Astro content collections, search indexes
- **Examples:**
  - `content.test.ts` - Content collection validation and loading
  - `routes.test.ts` - URL compatibility and redirects
  - `search.test.ts` - FlexSearch index querying

**Example (content.test.ts):**
```typescript
describe('Content Collection Integration', () => {
  describe('Posts Collection', () => {
    it('should load posts correctly', async () => {
      const posts = await mockGetCollection('posts');
      expect(posts).toHaveLength(2);
      expect(posts[0].data.title).toBe('Test Post 1');
    });

    it('should have required frontmatter fields', async () => {
      const posts = await mockGetCollection('posts');
      posts.forEach((post) => {
        expect(post.data.title).toBeDefined();
        expect(post.data.date).toBeInstanceOf(Date);
        expect(post.data.tags).toBeDefined();
      });
    });
  });
});
```

**E2E Tests:**
- **Not used:** No end-to-end testing framework (Cypress, Playwright, etc.)
- **Manual testing:** Content validation, performance analysis, mobile responsiveness
- **Scripts:** `scripts/validate-content.js`, `scripts/analyze-performance.js`, `scripts/test-mobile-responsiveness.js`

## Common Patterns

**Async Testing:**
```typescript
// Using async/await with waitFor
import { waitFor } from '@testing-library/react';

it('should render images after loading', async () => {
  render(<ImageGallery images={mockImages} />);

  await waitFor(() => {
    expect(screen.getAllByRole('img')).toHaveLength(mockImages.length);
  });
});

// Testing async functions
it('should fetch and process search index', async () => {
  const mockData = { index: 'mock' };
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response)
  );

  const result = await fetchSearchIndex();
  expect(result).toEqual(mockData);
});
```

**Error Testing:**
```typescript
// Testing error boundaries and fallbacks
it('should show loading indicator while loading', () => {
  render(<SearchResults />);
  expect(screen.getByText('Cargando índice de búsqueda...')).toBeInTheDocument();
});

// Testing error states
it('should show error message when fetch fails', async () => {
  global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

  render(<SearchResults />);

  await waitFor(() => {
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
  });
});

// Testing empty states
it('should handle empty images array', () => {
  render(<ImageGallery images={[]} />);
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});
```

**User Interaction Testing:**
```typescript
import { fireEvent, userEvent } from '@testing-library/react';

// Using fireEvent for simple interactions
it('should toggle search visibility', () => {
  render(<SearchComponent />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
});

// Testing keyboard navigation
it('should handle keyboard navigation in lightbox', async () => {
  render(<ImageGallery images={mockImages} />);

  await waitFor(() => {
    const firstImage = screen.getAllByRole('img')[0];
    fireEvent.click(firstImage.parentElement!);
  });

  fireEvent.keyDown(document, { key: 'ArrowRight' });
  expect(screen.getByText('2 de 3')).toBeInTheDocument();

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(document.body.style.overflow).toBe('unset');
});
```

**Hydration Testing:**
```typescript
// Prevent hydration mismatch by checking mounted state
it('should not render until mounted', () => {
  render(<ThemeToggle />);
  expect(screen.queryByText(/Cambiar a tema/)).not.toBeInTheDocument();
});

// Using mounted pattern
if (!mounted) {
  return <LoadingSpinner />;
}
```

## Testing Library Patterns

**Queries:**
- **Preferred:** getByRole, getByLabelText, getByPlaceholderText (accessible queries)
- **Secondary:** getByTestId (for elements without accessible attributes)
- **Avoid:** getByText (fragile to text changes)

**Examples:**
```typescript
// Accessible queries (preferred)
expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
expect(screen.getByLabelText(/copiar al portapapeles/i)).toBeInTheDocument();
expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();

// TestId (when necessary)
expect(screen.getByTestId('search-icon')).toBeInTheDocument();

// Query for absence
expect(screen.queryByPlaceholderText(/buscar/i)).not.toBeInTheDocument();
```

**FireEvent vs UserEvent:**
- **fireEvent:** Used for simple interactions (click, change, keyDown)
- **userEvent:** Not used (fireEvent sufficient for current tests)

## CI/CD Integration

**Pre-build check:**
```json
{
  "scripts": {
    "prebuild": "pnpm run lint && pnpm run test:run",
    "test:run": "vitest run"
  }
}
```

**Build process:**
1. Lint code (`pnpm run lint`)
2. Run tests (`pnpm run test:run`)
3. Build TinaCMS
4. Generate search index
5. Build Astro
6. Verify build output

**Test execution:**
- Watch mode for development (`pnpm run test`)
- Single run for CI (`pnpm run test:run`)
- Tests must pass before production build

---

*Testing analysis: 2026-02-04*

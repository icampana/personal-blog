import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Astro globals
global.Astro = {
  url: new URL('http://localhost:4321'),
  request: new Request('http://localhost:4321'),
  props: {},
  params: {},
  site: new URL('https://ivan.campananaranjo.com'),
  generator: 'Astro v5.13.8',
  glob: vi.fn(),
  redirect: vi.fn(),
  response: {
    headers: new Headers(),
  },
} as any;

// Mock theme-change
vi.mock('theme-change', () => ({
  themeChange: vi.fn(),
}));

// Mock reading-time
vi.mock('reading-time', () => ({
  default: vi.fn(() => ({ minutes: 5, text: '5 min read' })),
}));

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
        {
          id: 'test-post-2.md',
          slug: 'test-post-2',
          body: 'This is another test post about React',
          collection: 'posts',
          data: {
            title: 'Test Post 2',
            date: new Date('2023-01-10'),
            description: 'A test post about React',
            tags: ['react', 'test'],
            featuredImage: '/images/test.jpg',
          },
        },
      ];
    }
    return [];
  }),
}));

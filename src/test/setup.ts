import '@testing-library/jest-dom';

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
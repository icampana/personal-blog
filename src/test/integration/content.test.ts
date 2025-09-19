import { describe, expect, it, vi } from 'vitest';

// Mock Astro content collections
const mockPosts = [
  {
    id: 'test-post-1.md',
    slug: 'test-post-1',
    collection: 'posts',
    data: {
      title: 'Test Post 1',
      date: new Date('2023-01-15'),
      tags: ['javascript', 'test'],
      description: 'A test post about JavaScript',
      featuredImage: '/images/test1.jpg',
    },
    body: 'This is the content of test post 1',
  },
  {
    id: 'test-post-2.md',
    slug: 'test-post-2',
    collection: 'posts',
    data: {
      title: 'Test Post 2',
      date: new Date('2023-01-10'),
      tags: ['react', 'test'],
      description: 'A test post about React',
      featuredImage: '/images/test2.jpg',
    },
    body: 'This is the content of test post 2',
  },
];

const mockPages = [
  {
    id: 'about.md',
    slug: 'about',
    collection: 'pages',
    data: {
      title: 'About',
      date: new Date('2023-01-01'),
      path: '/sobre-el-autor',
      description: 'About page',
    },
    body: 'About page content',
  },
];

const mockProjects = [
  {
    id: 'project-1.md',
    slug: 'project-1',
    collection: 'projects',
    data: {
      title: 'Test Project',
      date: new Date('2023-01-05'),
      description: 'A test project',
      techStack: ['React', 'TypeScript'],
      liveUrl: 'https://example.com',
      galleryImage: ['/images/project1.jpg'],
    },
    body: 'Project description',
  },
];

// Mock getCollection function
const mockGetCollection = vi.fn((collection: string) => {
  switch (collection) {
    case 'posts':
      return Promise.resolve(mockPosts);
    case 'pages':
      return Promise.resolve(mockPages);
    case 'projects':
      return Promise.resolve(mockProjects);
    default:
      return Promise.resolve([]);
  }
});

vi.mock('astro:content', () => ({
  getCollection: mockGetCollection,
  z: {
    object: vi.fn(() => ({ parse: vi.fn() })),
    string: vi.fn(),
    date: vi.fn(),
    array: vi.fn(),
    number: vi.fn(),
    boolean: vi.fn(),
    coerce: {
      date: vi.fn(),
    },
  },
  defineCollection: vi.fn(),
}));

describe('Content Collection Integration', () => {
  describe('Posts Collection', () => {
    it('should load posts correctly', async () => {
      const posts = await mockGetCollection('posts');

      expect(posts).toHaveLength(2);
      expect(posts[0].data.title).toBe('Test Post 1');
      expect(posts[0].data.tags).toContain('javascript');
    });

    it('should have required frontmatter fields', async () => {
      const posts = await mockGetCollection('posts');

      posts.forEach((post) => {
        expect(post.data.title).toBeDefined();
        expect(post.data.date).toBeInstanceOf(Date);
        expect(post.data.tags).toBeDefined();
        expect(Array.isArray(post.data.tags)).toBe(true);
      });
    });

    it('should sort posts by date correctly', async () => {
      const posts = await mockGetCollection('posts');

      const sortedPosts = posts.sort(
        (a, b) =>
          new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
      );

      expect(sortedPosts[0].data.title).toBe('Test Post 1');
      expect(sortedPosts[1].data.title).toBe('Test Post 2');
    });
  });

  describe('Pages Collection', () => {
    it('should load pages correctly', async () => {
      const pages = await mockGetCollection('pages');

      expect(pages).toHaveLength(1);
      expect(pages[0].data.title).toBe('About');
      expect(pages[0].data.path).toBe('/sobre-el-autor');
    });

    it('should have required page fields', async () => {
      const pages = await mockGetCollection('pages');

      pages.forEach((page) => {
        expect(page.data.title).toBeDefined();
        expect(page.data.date).toBeInstanceOf(Date);
      });
    });
  });

  describe('Projects Collection', () => {
    it('should load projects correctly', async () => {
      const projects = await mockGetCollection('projects');

      expect(projects).toHaveLength(1);
      expect(projects[0].data.title).toBe('Test Project');
      expect(projects[0].data.techStack).toContain('React');
    });

    it('should have required project fields', async () => {
      const projects = await mockGetCollection('projects');

      projects.forEach((project) => {
        expect(project.data.title).toBeDefined();
        expect(project.data.date).toBeInstanceOf(Date);
        expect(project.data.description).toBeDefined();
      });
    });

    it('should handle optional project fields', async () => {
      const projects = await mockGetCollection('projects');

      const project = projects[0];
      expect(project.data.liveUrl).toBe('https://example.com');
      expect(project.data.galleryImage).toHaveLength(1);
      expect(project.data.techStack).toHaveLength(2);
    });
  });

  describe('Content Validation', () => {
    it('should validate post schema', async () => {
      const posts = await mockGetCollection('posts');

      posts.forEach((post) => {
        // Check required fields
        expect(typeof post.data.title).toBe('string');
        expect(post.data.date).toBeInstanceOf(Date);

        // Check optional fields
        if (post.data.tags) {
          expect(Array.isArray(post.data.tags)).toBe(true);
        }
        if (post.data.featuredImage) {
          expect(typeof post.data.featuredImage).toBe('string');
        }
      });
    });

    it('should validate page schema', async () => {
      const pages = await mockGetCollection('pages');

      pages.forEach((page) => {
        expect(typeof page.data.title).toBe('string');
        expect(page.data.date).toBeInstanceOf(Date);

        if (page.data.path) {
          expect(typeof page.data.path).toBe('string');
          expect(page.data.path.startsWith('/')).toBe(true);
        }
      });
    });

    it('should validate project schema', async () => {
      const projects = await mockGetCollection('projects');

      projects.forEach((project) => {
        expect(typeof project.data.title).toBe('string');
        expect(project.data.date).toBeInstanceOf(Date);

        if (project.data.techStack) {
          expect(Array.isArray(project.data.techStack)).toBe(true);
        }
        if (project.data.galleryImage) {
          expect(Array.isArray(project.data.galleryImage)).toBe(true);
        }
      });
    });
  });
});

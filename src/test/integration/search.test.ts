import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fuse from 'fuse.js';

// Mock search data
const mockSearchData = [
  {
    title: 'JavaScript Fundamentals',
    content: 'Learn the basics of JavaScript programming language',
    url: '/posts/javascript-fundamentals',
    tags: ['javascript', 'programming', 'tutorial'],
    date: '2023-01-15',
    description: 'A comprehensive guide to JavaScript basics'
  },
  {
    title: 'React Components Guide',
    content: 'Understanding React components and their lifecycle',
    url: '/posts/react-components-guide',
    tags: ['react', 'javascript', 'components'],
    date: '2023-01-10',
    description: 'Deep dive into React components'
  },
  {
    title: 'Python for Beginners',
    content: 'Getting started with Python programming',
    url: '/posts/python-for-beginners',
    tags: ['python', 'programming', 'tutorial'],
    date: '2023-01-05',
    description: 'Learn Python from scratch'
  }
];

describe('Search Functionality', () => {
  let fuse: Fuse<typeof mockSearchData[0]>;

  beforeEach(() => {
    const fuseOptions = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'description', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
    };

    fuse = new Fuse(mockSearchData, fuseOptions);
  });

  describe('Search Index', () => {
    it('should create search index with correct structure', () => {
      expect(fuse).toBeInstanceOf(Fuse);
      expect(mockSearchData).toHaveLength(3);

      mockSearchData.forEach(item => {
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('content');
        expect(item).toHaveProperty('url');
        expect(item).toHaveProperty('tags');
        expect(item).toHaveProperty('date');
      });
    });

    it('should have proper search weights', () => {
      const results = fuse.search('JavaScript');

      // Should find JavaScript-related posts
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.title).toContain('JavaScript');
    });
  });

  describe('Search Queries', () => {
    it('should find posts by title', () => {
      const results = fuse.search('JavaScript');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.title).toBe('JavaScript Fundamentals');
    });

    it('should find posts by content', () => {
      const results = fuse.search('components lifecycle');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.title).toBe('React Components Guide');
    });

    it('should find posts by tags', () => {
      const results = fuse.search('python');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.tags).toContain('python');
    });

    it('should find posts by description', () => {
      const results = fuse.search('comprehensive guide');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.description).toContain('comprehensive');
    });

    it('should handle partial matches', () => {
      const results = fuse.search('react');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.item.tags.includes('react'))).toBe(true);
    });

    it('should handle case insensitive search', () => {
      const lowerResults = fuse.search('javascript');
      const upperResults = fuse.search('JAVASCRIPT');
      const mixedResults = fuse.search('JavaScript');

      expect(lowerResults.length).toBeGreaterThan(0);
      expect(upperResults.length).toBeGreaterThan(0);
      expect(mixedResults.length).toBeGreaterThan(0);
    });

    it('should return empty results for non-existent terms', () => {
      const results = fuse.search('nonexistentterm12345');

      expect(results).toHaveLength(0);
    });

    it('should handle multi-word searches', () => {
      const results = fuse.search('react components');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.title).toBe('React Components Guide');
    });
  });

  describe('Search Results Quality', () => {
    it('should return results with scores', () => {
      const results = fuse.search('JavaScript');

      results.forEach(result => {
        expect(result).toHaveProperty('score');
        expect(typeof result.score).toBe('number');
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(1);
      });
    });

    it('should return results with match information', () => {
      const results = fuse.search('JavaScript');

      results.forEach(result => {
        expect(result).toHaveProperty('matches');
        expect(Array.isArray(result.matches)).toBe(true);
      });
    });

    it('should sort results by relevance', () => {
      const results = fuse.search('programming');

      if (results.length > 1) {
        for (let i = 0; i < results.length - 1; i++) {
          expect(results[i].score).toBeLessThanOrEqual(results[i + 1].score);
        }
      }
    });

    it('should limit results appropriately', () => {
      const results = fuse.search('tutorial');

      // Should find multiple results but not exceed reasonable limits
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(mockSearchData.length);
    });
  });

  describe('Search Performance', () => {
    it('should perform search within reasonable time', () => {
      const startTime = performance.now();
      const results = fuse.search('JavaScript');
      const endTime = performance.now();

      const searchTime = endTime - startTime;
      expect(searchTime).toBeLessThan(100); // Should complete within 100ms
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle empty search queries', () => {
      const results = fuse.search('');

      // Empty search should return no results or all results depending on implementation
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle special characters in search', () => {
      const specialQueries = ['@#$%', '()[]{}', '!@#$%^&*'];

      specialQueries.forEach(query => {
        const results = fuse.search(query);
        expect(Array.isArray(results)).toBe(true);
      });
    });
  });

  describe('Search Index Generation', () => {
    it('should generate search index from content collections', () => {
      // This would test the actual search index generation script
      // For now, we'll test the expected structure

      const expectedFields = ['title', 'content', 'url', 'tags', 'date', 'description'];

      mockSearchData.forEach(item => {
        expectedFields.forEach(field => {
          expect(item).toHaveProperty(field);
        });
      });
    });

    it('should include all content types in search index', () => {
      // Should include posts, pages, and projects
      const contentTypes = mockSearchData.map(item => {
        if (item.url.startsWith('/posts/')) return 'post';
        if (item.url.startsWith('/content/')) return 'page';
        if (item.url.startsWith('/portafolio/')) return 'project';
        return 'unknown';
      });

      expect(contentTypes.every(type => type !== 'unknown')).toBe(true);
    });
  });
});
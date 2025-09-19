import { readFileSync } from 'fs';
import Fuse from 'fuse.js';
import { join } from 'path';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Search Functionality', () => {
  let fuse: Fuse<any>;
  let searchData: any[];

  beforeEach(() => {
    // Load search data dynamically
    const searchDataPath = join(process.cwd(), 'public', 'search-posts.json');
    searchData = JSON.parse(readFileSync(searchDataPath, 'utf-8'));

    const fuseOptions = {
      keys: ['title', 'summary', 'content'],
      minMatchCharLength: 2,
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
    };

    fuse = new Fuse(searchData, fuseOptions);
  });

  describe('Search Data', () => {
    it('should load search data successfully', () => {
      expect(searchData).toBeDefined();
      expect(Array.isArray(searchData)).toBe(true);
      expect(searchData.length).toBeGreaterThan(0);
    });

    it('should have required fields in search data', () => {
      const firstItem = searchData[0];
      expect(firstItem).toHaveProperty('title');
      expect(firstItem).toHaveProperty('content');
      expect(firstItem).toHaveProperty('summary');
      expect(firstItem).toHaveProperty('url');
    });
  });

  describe('Search Queries', () => {
    it('should find posts by content', () => {
      const results = fuse.search('desarrollo');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find posts by title', () => {
      const results = fuse.search('React');
      expect(results.length).toBeGreaterThan(0);
      const found = results.some(
        (r) =>
          r.item.title.toLowerCase().includes('react') ||
          r.item.content.toLowerCase().includes('react'),
      );
      expect(found).toBe(true);
    });

    it('should find posts by summary', () => {
      const results = fuse.search('programador');
      expect(results.length).toBeGreaterThan(0);
      const found = results.some(
        (r) =>
          r.item.summary.toLowerCase().includes('programador') ||
          r.item.content.toLowerCase().includes('programador'),
      );
      expect(found).toBe(true);
    });
  });
});

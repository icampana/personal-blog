import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatDate,
  getReadingTime,
  getPostUrl,
  getPageUrl,
  getProjectUrl,
  getAllTags,
  getPostsByTag,
  sortPostsByDate
} from '../utils';
import type { CollectionEntry } from 'astro:content';

// Mock data
const mockPost: CollectionEntry<'posts'> = {
  id: 'test-post.md',
  slug: 'test-post',
  body: 'This is a test post with some content that should take about 1 minute to read.',
  collection: 'posts',
  data: {
    title: 'Test Post',
    date: new Date('2023-01-15'),
    description: 'A test post',
    tags: ['test', 'javascript'],
    featuredImage: '/images/test.jpg',
  },
  render: async () => ({ Content: () => null, headings: [] }),
};

const mockPage: CollectionEntry<'pages'> = {
  id: 'about.md',
  slug: 'about',
  body: 'About page content',
  collection: 'pages',
  data: {
    title: 'About',
    date: new Date('2023-01-01'),
    path: '/sobre-el-autor',
  },
  render: async () => ({ Content: () => null, headings: [] }),
};

const mockProject: CollectionEntry<'projects'> = {
  id: 'test-project.md',
  slug: 'test-project',
  body: 'Project description',
  collection: 'projects',
  data: {
    title: 'Test Project',
    date: new Date('2023-01-10'),
    description: 'A test project',
    techStack: ['React', 'TypeScript'],
    liveUrl: 'https://example.com',
  },
  render: async () => ({ Content: () => null, headings: [] }),
};

describe('Utility Functions', () => {
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

  describe('getReadingTime', () => {
    it('should calculate reading time for content', () => {
      const content = 'This is a test content with multiple words that should take some time to read. '.repeat(50);
      const readingTime = getReadingTime(content);
      expect(readingTime.minutes).toBeGreaterThan(0);
      expect(readingTime.text).toContain('min');
    });

    it('should handle empty content', () => {
      const readingTime = getReadingTime('');
      expect(readingTime.minutes).toBe(0);
    });
  });

  describe('URL generation functions', () => {
    it('should generate correct post URL', () => {
      const url = getPostUrl(mockPost);
      expect(url).toBe('/posts/test-post');
    });

    it('should generate correct post URL with custom path', () => {
      const postWithPath = {
        ...mockPost,
        data: { ...mockPost.data, path: '/custom/path' }
      };
      const url = getPostUrl(postWithPath);
      expect(url).toBe('/posts/custom/path');
    });

    it('should generate correct page URL', () => {
      const url = getPageUrl(mockPage);
      expect(url).toBe('/content/sobre-el-autor');
    });

    it('should generate correct page URL without custom path', () => {
      const pageWithoutPath = {
        ...mockPage,
        data: { ...mockPage.data, path: undefined }
      };
      const url = getPageUrl(pageWithoutPath);
      expect(url).toBe('/content/about');
    });

    it('should generate correct project URL', () => {
      const url = getProjectUrl(mockProject);
      expect(url).toBe('/portafolio/test-project');
    });
  });

  describe('Tag functions', () => {
    const mockPosts = [
      mockPost,
      {
        ...mockPost,
        id: 'post2.md',
        slug: 'post2',
        data: { ...mockPost.data, tags: ['javascript', 'react'] }
      },
      {
        ...mockPost,
        id: 'post3.md',
        slug: 'post3',
        data: { ...mockPost.data, tags: ['python'] }
      }
    ] as CollectionEntry<'posts'>[];

    it('should get all unique tags', () => {
      const tags = getAllTags(mockPosts);
      expect(tags).toContain('test');
      expect(tags).toContain('javascript');
      expect(tags).toContain('react');
      expect(tags).toContain('python');
      expect(tags.length).toBe(4);
    });

    it('should get posts by tag', () => {
      const jsPosts = getPostsByTag(mockPosts, 'javascript');
      expect(jsPosts.length).toBe(2);
      expect(jsPosts.every(post => post.data.tags?.includes('javascript'))).toBe(true);
    });

    it('should return empty array for non-existent tag', () => {
      const posts = getPostsByTag(mockPosts, 'nonexistent');
      expect(posts.length).toBe(0);
    });
  });

  describe('sortPostsByDate', () => {
    it('should sort posts by date descending', () => {
      const posts = [
        { ...mockPost, data: { ...mockPost.data, date: new Date('2023-01-01') } },
        { ...mockPost, data: { ...mockPost.data, date: new Date('2023-01-15') } },
        { ...mockPost, data: { ...mockPost.data, date: new Date('2023-01-10') } },
      ] as CollectionEntry<'posts'>[];

      const sorted = sortPostsByDate(posts);
      expect(sorted[0].data.date.getTime()).toBeGreaterThan(sorted[1].data.date.getTime());
      expect(sorted[1].data.date.getTime()).toBeGreaterThan(sorted[2].data.date.getTime());
    });
  });
});
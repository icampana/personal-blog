import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import {
  getCleanSlug,
  getLanguageFromFilename,
  getPostsByLocale,
  LOCALES,
  type Locale,
  POSTS_PER_PAGE,
} from '../utils/i18n';

const mockPost = (id: string): CollectionEntry<'posts'> => ({
  id,
  body: '',
  collection: 'posts',
  data: { title: id, date: new Date('2023-01-15') },
  render: async () => ({ Content: () => null, headings: [] }),
});

describe('getLanguageFromFilename (path-based)', () => {
  it('derives locale from the first path segment', () => {
    expect(getLanguageFromFilename('es/2023-01-15-mi-post')).toBe('es');
    expect(getLanguageFromFilename('en/2023-01-15-mi-post')).toBe('en');
    expect(getLanguageFromFilename('pt/2023-01-15-mi-post')).toBe('pt');
    expect(getLanguageFromFilename('fr/2023-01-15-mi-post')).toBe('fr');
  });

  it('returns null for ids without a locale segment', () => {
    expect(getLanguageFromFilename('2023-01-15-mi-post')).toBeNull();
  });
});

describe('getCleanSlug (path-based)', () => {
  it('strips locale prefix, date prefix and extension', () => {
    expect(getCleanSlug('es/2023-01-15-mi-post')).toBe('mi-post');
    expect(getCleanSlug('en/2023-01-15-mi-post')).toBe('mi-post');
  });

  it('keeps slugs without date prefix', () => {
    expect(getCleanSlug('en/mi-post')).toBe('mi-post');
  });
});

describe('getPostsByLocale', () => {
  const esPost = mockPost('es/2023-01-15-mi-post');
  const enPost = mockPost('en/2023-01-15-mi-post');
  const frPost = mockPost('fr/2023-01-15-mi-post');
  const ptPost = mockPost('pt/2023-01-15-mi-post');
  const posts = [esPost, enPost, frPost, ptPost];

  it('returns only es posts for the default locale', () => {
    const result = getPostsByLocale(posts, LOCALES.DEFAULT);
    expect(result.map((p) => p.id)).toEqual(['es/2023-01-15-mi-post']);
  });

  it('returns only posts for the requested locale', () => {
    expect(getPostsByLocale(posts, LOCALES.ENGLISH).map((p) => p.id)).toEqual([
      'en/2023-01-15-mi-post',
    ]);
    expect(
      getPostsByLocale(posts, LOCALES.PORTUGUESE).map((p) => p.id),
    ).toEqual(['pt/2023-01-15-mi-post']);
  });

  it('handles Spanish slugs that naturally end in "en" without ambiguity', () => {
    const esEndsInEn = mockPost(
      'es/2009-03-27-cansancio-dolor-y-estres-convertidos-en',
    );
    expect(
      getPostsByLocale([esEndsInEn], LOCALES.DEFAULT).map((p) => p.id),
    ).toEqual(['es/2009-03-27-cansancio-dolor-y-estres-convertidos-en']);
    expect(getPostsByLocale([esEndsInEn], LOCALES.ENGLISH)).toEqual([]);
  });
});

describe('POSTS_PER_PAGE', () => {
  it('is defined and positive', () => {
    expect(POSTS_PER_PAGE).toBeGreaterThan(0);
  });
});

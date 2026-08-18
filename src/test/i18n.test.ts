import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import {
  getLanguageFromFilename,
  getPostsByLocale,
  LOCALES,
  type Locale,
  POSTS_PER_PAGE,
} from '../utils/i18n';

// Mock a post with the given id
const mockPost = (id: string): CollectionEntry<'posts'> => ({
  id,
  body: '',
  collection: 'posts',
  data: {
    title: id,
    date: new Date('2023-01-15'),
  },
  render: async () => ({ Content: () => null, headings: [] }),
});

// NOTE: the glob loader strips extensions and dots: foo.en.md -> id "fooen"
describe('getPostsByLocale', () => {
  // Spanish (default) posts: flat and folder-based
  const esFlat = mockPost('2023-01-15-mi-post');
  const esFolder = mockPost('mi-post/index');
  // Spanish slug that naturally ends in "en" (must NOT be treated as English)
  const esEndsInEn = mockPost(
    '2009-03-27-cansancio-dolor-y-estres-convertidos-en',
  );
  // Real translations: stem + suffix, dotless
  const enFlat = mockPost('2023-01-15-mi-posten');
  const enFolder = mockPost('mi-post/indexen');
  const frFlat = mockPost('2023-01-15-mi-postfr');
  const ptFlat = mockPost('2023-01-15-mi-postpt');
  const posts = [
    esFlat,
    esFolder,
    esEndsInEn,
    enFlat,
    enFolder,
    frFlat,
    ptFlat,
  ];

  it('includes only Spanish posts when locale is es', () => {
    const result = getPostsByLocale(posts, LOCALES.DEFAULT);
    expect(result.map((p) => p.id).sort()).toEqual([
      '2009-03-27-cansancio-dolor-y-estres-convertidos-en',
      '2023-01-15-mi-post',
      'mi-post/index',
    ]);
  });

  it('returns only English posts for en locale', () => {
    const result = getPostsByLocale(posts, LOCALES.ENGLISH);
    expect(result.map((p) => p.id).sort()).toEqual([
      '2023-01-15-mi-posten',
      'mi-post/indexen',
    ]);
  });

  it('returns only French posts for fr locale', () => {
    const result = getPostsByLocale(posts, LOCALES.FRENCH);
    expect(result.map((p) => p.id)).toEqual(['2023-01-15-mi-postfr']);
  });

  it('returns only Portuguese posts for pt locale', () => {
    const result = getPostsByLocale(posts, LOCALES.PORTUGUESE);
    expect(result.map((p) => p.id)).toEqual(['2023-01-15-mi-postpt']);
  });

  it('does not misclassify Spanish slugs ending in en/fr/pt', () => {
    const result = getPostsByLocale(posts, LOCALES.ENGLISH);
    expect(
      result.some(
        (p) => p.id === '2009-03-27-cansancio-dolor-y-estres-convertidos-en',
      ),
    ).toBe(false);
  });

  it('handles a Spanish slug ending in "en" with a real English translation', () => {
    // commitizen.md (Spanish) + commitizen.en.md -> id "...commitizenen"
    const esCommitizen = mockPost(
      '2025-4-tus-commits-son-un-desastre-aprende-a-estandarizarlos-con-commitlint-husky-y-commitizen',
    );
    const enCommitizen = mockPost(
      '2025-4-tus-commits-son-un-desastre-aprende-a-estandarizarlos-con-commitlint-husky-y-commitizenen',
    );
    const frCommitizen = mockPost(
      '2025-4-tus-commits-son-un-desastre-aprende-a-estandarizarlos-con-commitlint-husky-y-commitizenfr',
    );

    const es = getPostsByLocale(
      [esCommitizen, enCommitizen, frCommitizen],
      LOCALES.DEFAULT,
    );
    const en = getPostsByLocale(
      [esCommitizen, enCommitizen, frCommitizen],
      LOCALES.ENGLISH,
    );

    expect(es.map((p) => p.id)).toEqual([esCommitizen.id]);
    expect(en.map((p) => p.id)).toEqual([enCommitizen.id]);
  });

  it('returns empty array for locale with no posts', () => {
    const result = getPostsByLocale([esFlat], LOCALES.FRENCH);
    expect(result).toEqual([]);
  });

  it('keeps getLanguageFromFilename for non-ambiguous ids', () => {
    expect(getLanguageFromFilename('foo.en.md')).toBe('en');
    expect(getLanguageFromFilename('foo.fr.md')).toBe('fr');
    expect(getLanguageFromFilename('foo.pt.md')).toBe('pt');
    expect(getLanguageFromFilename('foo.md')).toBeNull();
    expect(getLanguageFromFilename('foo')).toBeNull();
  });
});

describe('POSTS_PER_PAGE', () => {
  it('is defined and positive', () => {
    expect(POSTS_PER_PAGE).toBeGreaterThan(0);
  });
});

describe('Localized pagination URL patterns', () => {
  const localizedPaginationUrls = (locale: Locale): string[] => [
    `/${locale}/posts`,
    `/${locale}/posts/page/2`,
  ];

  it('should validate English pagination URL patterns', () => {
    localizedPaginationUrls(LOCALES.ENGLISH).forEach((url) => {
      expect(url).toMatch(/^\/en\/posts(\/page\/\d+)?$/);
    });
  });

  it('should validate French pagination URL patterns', () => {
    localizedPaginationUrls(LOCALES.FRENCH).forEach((url) => {
      expect(url).toMatch(/^\/fr\/posts(\/page\/\d+)?$/);
    });
  });

  it('should validate Portuguese pagination URL patterns', () => {
    localizedPaginationUrls(LOCALES.PORTUGUESE).forEach((url) => {
      expect(url).toMatch(/^\/pt\/posts(\/page\/\d+)?$/);
    });
  });
});

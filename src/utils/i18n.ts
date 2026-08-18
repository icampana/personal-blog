import type { CollectionEntry } from 'astro:content';

// Supported locales
export const LOCALES = {
  DEFAULT: 'es',
  ENGLISH: 'en',
  PORTUGUESE: 'pt',
  FRENCH: 'fr',
} as const;

export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

// Posts per page for paginated post lists
export const POSTS_PER_PAGE = 12;

// Regex patterns
const LOCALE_PREFIX_REGEX = /^(\/(en|pt|fr)\/)/;

// Locale is now the first path segment of a collection id (es/foo, en/foo).
const LOCALE_SEGMENT = new Set(['es', 'en', 'pt', 'fr']);

/**
 * Extract language from a content collection id (first path segment).
 */
export function getLanguageFromFilename(id: string): Locale | null {
  const first = id.split('/')[0];
  return LOCALE_SEGMENT.has(first) ? (first as Locale) : null;
}

/**
 * Strip the locale prefix segment from a collection id.
 */
export function stripLanguageSuffix(id: string): string {
  const lang = getLanguageFromFilename(id);
  return lang ? id.slice(lang.length + 1) : id;
}

/**
 * Get clean slug (without locale prefix, date prefix, extension, and /index).
 */
export function getCleanSlug(slug: string): string {
  let cleanSlug = stripLanguageSuffix(slug)
    .replace(/\.md$/i, '')
    .replace(/\/?index$/, '');

  if (cleanSlug.match(/^\d{4}-\d{2}-\d{2}-/)) {
    const parts = cleanSlug.split('-');
    cleanSlug = parts.slice(3).join('-');
  }

  return cleanSlug;
}

/**
 * Extract language from URL path
 */
export function getLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(en|pt|fr)\//);
  return (match?.[1] as Locale) || LOCALES.DEFAULT;
}

/**
 * Remove locale prefix from path
 */
export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX_REGEX, '/');
}

/**
 * Format URL with locale prefix
 */
export function getLocalizedUrl(path: string, locale: Locale): string {
  if (locale === LOCALES.DEFAULT) {
    return path;
  }
  return `/${locale}${path}`;
}

/**
 * Check if a post has a translation for a specific locale
 */
export async function hasTranslation(
  posts: CollectionEntry<'posts'>[],
  baseSlug: string,
  locale: Locale,
): Promise<boolean> {
  return posts.some((post) => {
    const postLanguage = getLanguageFromFilename(post.id);
    const postCleanSlug = getCleanSlug(post.id);
    return postLanguage === locale && postCleanSlug === baseSlug;
  });
}

/**
 * Filter posts by locale (derived from the first path segment).
 */
export function getPostsByLocale(
  posts: CollectionEntry<'posts'>[],
  locale: Locale,
): CollectionEntry<'posts'>[] {
  return posts.filter((post) => getLanguageFromFilename(post.id) === locale);
}

/**
 * Get all available translations for a post
 */
export async function getAvailableTranslations(
  posts: CollectionEntry<'posts'>[],
  baseSlug: string,
): Promise<Partial<Record<Locale, string>>> {
  const translations: Partial<Record<Locale, string>> = {};

  for (const post of posts) {
    const postLanguage = getLanguageFromFilename(post.id);
    const postCleanSlug = getCleanSlug(post.id);

    // Only add if clean slug matches
    if (postCleanSlug === baseSlug) {
      if (postLanguage) {
        // Add language-specific translation
        translations[postLanguage] = post.id;
      } else {
        // Add Spanish post as default (no translation needed)
        // Only add if Spanish not already present
        if (!translations['es']) {
          translations['es'] = post.id;
        }
      }
    }
  }

  return translations;
}

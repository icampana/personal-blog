import type { CollectionEntry } from 'astro:content';

// Supported locales
export const LOCALES = {
  DEFAULT: 'es',
  ENGLISH: 'en',
  PORTUGUESE: 'pt',
} as const;

export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

// Regex patterns
const LANGUAGE_SUFFIX_REGEX = /\.(en|pt)(\.md)?$/i;
const LOCALE_PREFIX_REGEX = /^(\/(en|pt)\/)/;

/**
 * Extract language from URL path
 */
export function getLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(en|pt)\//);
  return (match?.[1] as Locale) || LOCALES.DEFAULT;
}

/**
 * Remove locale prefix from path
 */
export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX_REGEX, '/');
}

/**
 * Extract language suffix from filename
 */
export function getLanguageFromFilename(filename: string): Locale | null {
  const match = filename.match(LANGUAGE_SUFFIX_REGEX);
  return match ? (match[1] as Locale) : null;
}

/**
 * Strip language suffix from filename
 */
export function stripLanguageSuffix(filename: string): string {
  return filename.replace(LANGUAGE_SUFFIX_REGEX, (match, lang, ext) => {
    return ext ? '.md' : '';
  });
}

/**
 * Get clean slug (without date prefix and language suffix)
 */
export function getCleanSlug(slug: string): string {
  // Remove language suffix
  let cleanSlug = stripLanguageSuffix(slug);

  // Remove date prefix if present (YYYY-MM-DD-)
  if (cleanSlug.match(/^\d{4}-\d{2}-\d{2}-/)) {
    const parts = cleanSlug.split('-');
    cleanSlug = parts.slice(3).join('-');
  }

  return cleanSlug;
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
    const postCleanSlug = getCleanSlug(post.slug);
    return postLanguage === locale && postCleanSlug === baseSlug;
  });
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
    const postCleanSlug = getCleanSlug(post.slug);

    if (postCleanSlug === baseSlug && postLanguage) {
      translations[postLanguage] = post.slug;
    }
  }

  return translations;
}

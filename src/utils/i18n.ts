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
// The glob loader appends locale suffixes both as `.en` and `en` depending on the filename,
// so accept an optional leading dot and an optional `.md` extension.
const LANGUAGE_SUFFIX_REGEX = /\.?(en|pt|fr)(\.md)?$/i;
const LOCALE_PREFIX_REGEX = /^(\/(en|pt|fr)\/)/;

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
 * Get clean slug (without date prefix, language suffix, and /index)
 */
export function getCleanSlug(slug: string): string {
  // Remove language suffix and file extension
  let cleanSlug = stripLanguageSuffix(slug).replace(/\.md$/i, '');

  // Remove date prefix if present (YYYY-MM-DD-)
  if (cleanSlug.match(/^\d{4}-\d{2}-\d{2}-/)) {
    const parts = cleanSlug.split('-');
    cleanSlug = parts.slice(3).join('-');
  }

  // Remove /index suffix for folder-based content (handles Spanish /index and dotted/dotless translations)
  cleanSlug = cleanSlug.replace(/\/?index\.?(en|pt|fr)?$/, '');

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
    const postCleanSlug = getCleanSlug(post.id);
    return postLanguage === locale && postCleanSlug === baseSlug;
  });
}

/**
 * Filter posts by locale.
 *
 * Uses collection-aware detection: the glob loader produces dotless ids
 * (foo.en.md -> "fooen"), so a Spanish slug that naturally ends in "en"/"fr"/"pt"
 * (e.g. "...-commitizen") must NOT be treated as a translation. A post is a
 * translation only when its stem (id minus language suffix, ignoring /index)
 * exists as a Spanish post id in the collection.
 */
export function getPostsByLocale(
  posts: CollectionEntry<'posts'>[],
  locale: Locale,
): CollectionEntry<'posts'>[] {
  const ids = new Set(posts.map((post) => post.id));

  const getLang = (id: string): Locale | null => {
    for (const lang of ['en', 'fr', 'pt'] as const) {
      if (id.endsWith(lang)) {
        // Strip the suffix and any folder /index marker, then check the stem
        // is a real Spanish post (translation source of truth).
        const stem = id.slice(0, -lang.length).replace(/\/index$/, '');
        if (ids.has(stem) || ids.has(`${stem}/index`)) {
          return lang;
        }
      }
    }
    return null;
  };

  return posts.filter((post) => {
    const lang = getLang(post.id);
    if (locale === LOCALES.DEFAULT) {
      return lang === null || lang === LOCALES.DEFAULT;
    }
    return lang === locale;
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

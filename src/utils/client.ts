import type { CollectionEntry } from 'astro:content';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Locale } from './i18n';
import { getCleanSlug, stripLanguageSuffix } from './i18n';

export function formatDate(date: Date): string {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function getPostUrl(
  post: CollectionEntry<'posts'>,
  locale?: Locale,
): string {
  const localePrefix = locale && locale !== 'es' ? `/${locale}` : '';

  // Use post.id to derive clean slug because post.slug might have dots removed/modified
  // stripLanguageSuffix returns filename with .md if it was .en.md, so we strip .md
  let cleanSlug = stripLanguageSuffix(post.id).replace(/\.md$/i, '');

  // Remove /index from the end if present (for folder-based posts)
  cleanSlug = cleanSlug.replace(/\/index$/, '');

  if (post.data.path) {
    return `${localePrefix}/posts${post.data.path}`;
  }

  // Handle legacy date-based URLs
  if (cleanSlug.match(/^\d{4}-\d{2}-\d{2}-/)) {
    // Extract date parts and slug from filename
    const parts = cleanSlug.split('-');
    const year = parts[0];
    const month = parts[1];
    const postSlug = parts.slice(3).join('-');
    return `${localePrefix}/posts/${year}/${month}/${postSlug}`;
  }

  return `${localePrefix}/posts/${cleanSlug}`;
}

export function getPageUrl(
  page: CollectionEntry<'pages'>,
  locale?: Locale,
): string {
  const localePrefix = locale && locale !== 'es' ? `/${locale}` : '';

  if (page.data.path) {
    return `${localePrefix}/content${page.data.path}`;
  }
  // Use getCleanSlug to remove /index and language suffixes from the slug
  const cleanSlug = getCleanSlug(page.slug);
  return `${localePrefix}/content/${cleanSlug}`;
}

export function getProjectUrl(
  project: CollectionEntry<'projects'>,
  locale?: Locale,
): string {
  const localePrefix = locale && locale !== 'es' ? `/${locale}` : '';

  if (project.data.path) {
    return `${localePrefix}/portafolio${project.data.path}`;
  }
  // Use getCleanSlug to remove /index and language suffixes from the slug
  const cleanSlug = getCleanSlug(project.slug);
  return `${localePrefix}/portafolio/${cleanSlug}`;
}

export function getAllTags(posts: CollectionEntry<'posts'>[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    if (post.data.tags) {
      post.data.tags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

export function getPostsByTag(
  posts: CollectionEntry<'posts'>[],
  tag: string,
): CollectionEntry<'posts'>[] {
  return posts.filter((post) => post.data.tags && post.data.tags.includes(tag));
}

export function sortPostsByDate(
  posts: CollectionEntry<'posts'>[],
): CollectionEntry<'posts'>[] {
  return posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
}

import type { CollectionEntry } from 'astro:content';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Locale } from './i18n';

export function formatDate(date: Date): string {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function getPostUrl(
  post: CollectionEntry<'posts'>,
  locale?: Locale,
): string {
  const localePrefix = locale && locale !== 'es' ? `/${locale}` : '';

  if (post.data.path) {
    return `${localePrefix}/posts${post.data.path}`;
  }

  // Handle legacy date-based URLs
  const slug = post.slug;
  if (slug.match(/^\d{4}-\d{2}-\d{2}-/)) {
    // Extract date parts and slug from filename
    const parts = slug.split('-');
    const year = parts[0];
    const month = parts[1];
    const postSlug = parts.slice(3).join('-');
    return `${localePrefix}/posts/${year}/${month}/${postSlug}`;
  }

  return `${localePrefix}/posts/${slug}`;
}

export function getPageUrl(
  page: CollectionEntry<'pages'>,
  locale?: Locale,
): string {
  const localePrefix = locale && locale !== 'es' ? `/${locale}` : '';

  if (page.data.path) {
    return `${localePrefix}/content${page.data.path}`;
  }
  return `${localePrefix}/content/${page.slug}`;
}

export function getProjectUrl(
  project: CollectionEntry<'projects'>,
  locale?: Locale,
): string {
  const localePrefix = locale && locale !== 'es' ? `/${locale}` : '';

  if (project.data.path) {
    return `${localePrefix}/portafolio${project.data.path}`;
  }
  return `${localePrefix}/portafolio/${project.slug}`;
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

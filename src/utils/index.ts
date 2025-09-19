import type { CollectionEntry } from 'astro:content';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import readingTime from 'reading-time';
import striptags from 'striptags';

export function getReadingTime(content: string) {
  return readingTime(content);
}

export function getSummary(htmlContent: string, length: number = 200): string {
  return striptags(htmlContent).slice(0, length);
}

export function formatDate(date: Date): string {
  return format(date, 'MMMM d, yyyy', { locale: es });
}

export function getPostUrl(post: CollectionEntry<'posts'>): string {
  if (post.data.path) {
    return `/posts${post.data.path}`;
  }

  // Handle legacy date-based URLs
  const slug = post.slug;
  if (slug.match(/^\d{4}-\d{2}-\d{2}-/)) {
    // Extract date parts and slug from filename
    const parts = slug.split('-');
    const year = parts[0];
    const month = parts[1];
    const postSlug = parts.slice(3).join('-');
    return `/posts/${year}/${month}/${postSlug}`;
  }

  return `/posts/${slug}`;
}

export function getPageUrl(page: CollectionEntry<'pages'>): string {
  if (page.data.path) {
    return `/content${page.data.path}`;
  }
  return `/content/${page.slug}`;
}

export function getProjectUrl(project: CollectionEntry<'projects'>): string {
  if (project.data.path) {
    return `/portafolio${project.data.path}`;
  }
  return `/portafolio/${project.slug}`;
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

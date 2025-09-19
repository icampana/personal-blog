import type { CollectionEntry } from 'astro:content';
import { getSummary } from '../utils';

export interface SearchItem {
  title: string;
  url: string;
  content: string;
  summary: string;
  tags?: string[];
  date: string;
  type: 'post' | 'page' | 'project';
}

export function createSearchIndex(
  posts: CollectionEntry<'posts'>[],
  pages: CollectionEntry<'pages'>[],
  projects: CollectionEntry<'projects'>[],
): SearchItem[] {
  const searchItems: SearchItem[] = [];

  // Add posts to search index
  posts.forEach((post) => {
    searchItems.push({
      title: post.data.title,
      url: post.data.path ? `/posts${post.data.path}` : `/posts/${post.slug}`,
      content: post.body,
      summary: getSummary(post.body),
      tags: post.data.tags,
      date: post.data.date.toISOString(),
      type: 'post',
    });
  });

  // Add pages to search index
  pages.forEach((page) => {
    searchItems.push({
      title: page.data.title,
      url: page.data.path
        ? `/content${page.data.path}`
        : `/content/${page.slug}`,
      content: page.body,
      summary: getSummary(page.body),
      date: page.data.date.toISOString(),
      type: 'page',
    });
  });

  // Add projects to search index
  projects.forEach((project) => {
    searchItems.push({
      title: project.data.title,
      url: project.data.path
        ? `/portafolio${project.data.path}`
        : `/portafolio/${project.slug}`,
      content: project.body,
      summary: getSummary(project.body),
      tags: project.data.techStack,
      date: project.data.date.toISOString(),
      type: 'project',
    });
  });

  return searchItems;
}

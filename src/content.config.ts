import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    path: z.string().optional(),
    featuredImage: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    locale: z.string().default('es').optional(),
    // Legacy fields from WordPress/Blogger migration
    wordpress_id: z.number().optional(),
    author: z.string().optional(),
    comments: z.boolean().optional(),
    layout: z.string().optional(),
    categories: z.array(z.string()).optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    path: z.string().optional(),
    description: z.string().optional(),
    // Legacy fields from WordPress/Blogger migration
    wordpress_id: z.number().optional(),
    author: z.string().optional(),
    comments: z.boolean().optional(),
    layout: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    path: z.string().optional(),
    description: z.string().optional(),
    galleryImage: z.array(z.string()).optional(),
    techStack: z.array(z.string()).optional(),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/videos' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    videoId: z.string(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = {
  posts,
  pages,
  projects,
  videos,
};

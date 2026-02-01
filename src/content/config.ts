import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    path: z.string().optional(),
    featuredImage: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // Legacy fields from WordPress/Blogger migration
    wordpress_id: z.number().optional(),
    author: z.string().optional(),
    comments: z.boolean().optional(),
    layout: z.string().optional(),
    categories: z.array(z.string()).optional(),
  }),
});

const pages = defineCollection({
  type: 'content',
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
  type: 'content',
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
  type: 'content',
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

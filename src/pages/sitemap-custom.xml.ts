import { getCollection } from 'astro:content';
import { getPageUrl, getPostUrl, getProjectUrl } from '../utils/client';

export async function GET() {
  const siteUrl = 'https://ivan.campananaranjo.com';

  // Get all content
  const posts = await getCollection('posts');
  const pages = await getCollection('pages');
  const projects = await getCollection('projects');

  // Static pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/posts', changefreq: 'daily', priority: '0.9' },
    { url: '/portafolio', changefreq: 'weekly', priority: '0.8' },
    { url: '/tag', changefreq: 'weekly', priority: '0.7' },
    { url: '/search', changefreq: 'monthly', priority: '0.6' },
  ];

  // Generate sitemap entries
  const sitemapEntries = [
    // Static pages
    ...staticPages.map((page) => ({
      url: `${siteUrl}${page.url}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
    })),

    // Blog posts
    ...posts.map((post) => ({
      url: `${siteUrl}${getPostUrl(post)}`,
      lastmod: post.data.date.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.8',
    })),

    // Pages
    ...pages.map((page) => ({
      url: `${siteUrl}${getPageUrl(page)}`,
      lastmod: page.data.date.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7',
    })),

    // Projects
    ...projects.map((project) => ({
      url: `${siteUrl}${getProjectUrl(project)}`,
      lastmod: project.data.date.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

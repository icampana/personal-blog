import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { getPostUrl, sortPostsByDate } from '../utils/client';
import { getLanguageFromFilename } from '../utils/i18n';

export async function GET(context: { site?: string }) {
  const allPosts = await getCollection('posts');
  const posts = allPosts.filter((post) => {
    const lang = getLanguageFromFilename(post.id);
    return lang === 'es' || lang === null;
  });
  const sortedPosts = sortPostsByDate(posts);

  return rss({
    title: 'Iván Gabriel - Blog',
    description:
      'Diario de un Informático, Emprendedor, Desarrollador y Curioso a tiempo completo.',
    site: context.site || 'https://ivan.campananaranjo.com',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || post.body.slice(0, 200) + '...',
      link: getPostUrl(post),
      categories: post.data.tags || [],
      author: 'ivan@campananaranjo.com (Iván Campaña)',
    })),
    customData: `
      <language>es-ES</language>
      <managingEditor>ivan@campananaranjo.com (Iván Campaña)</managingEditor>
      <webMaster>ivan@campananaranjo.com (Iván Campaña)</webMaster>
      <copyright>Copyright ${new Date().getFullYear()}, Iván Gabriel</copyright>
      <category>Technology</category>
      <category>Programming</category>
      <category>Entrepreneurship</category>
      <ttl>60</ttl>
    `,
  });
}

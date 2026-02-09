import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { getPostUrl, sortPostsByDate } from '../../utils/client';
import { getLanguageFromFilename } from '../../utils/i18n';

export async function GET(context: { site?: string }) {
  const allPosts = await getCollection('posts');
  const posts = allPosts.filter(
    (post) => getLanguageFromFilename(post.id) === 'en',
  );
  const sortedPosts = sortPostsByDate(posts);

  return rss({
    title: 'Iván Gabriel - Blog (English)',
    description:
      'Diary of a Computer Scientist, Entrepreneur, Developer, and Full-time Curious Mind.',
    site: context.site
      ? `${context.site}/en`
      : 'https://ivan.campananaranjo.com/en',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || post.body.slice(0, 200) + '...',
      link: getPostUrl(post, 'en'),
      categories: post.data.tags || [],
      author: 'ivan@campananaranjo.com (Iván Campaña)',
    })),
    customData: `
      <language>en-US</language>
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

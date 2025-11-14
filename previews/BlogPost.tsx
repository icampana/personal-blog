import BlogPost from 'components/blocks/BlogPost';
import { endOfDay, formatISO } from 'date-fns';
import { marked } from 'marked';
import readingTime from 'reading-time';

interface Post {
  title: string;
  date: string;
  path?: string;
  featuredImage?: string;
  description?: string;
  tags?: string[];
  wordpress_id?: number;
  author?: string;
  comments?: boolean;
  layout?: string;
  categories?: string[];
  body: { html: string };
  readingTime: { text: string; minutes: number; time: number; words: number };
}

interface BlogPostPreviewProps {
  entry: unknown;
}

const BlogPostPreview = async ({ entry }: BlogPostPreviewProps) => {
  const data = (entry as any).getIn(['data']).toJS();

  if (!data) {
    return <div>Loading...</div>;
  }

  const featuredImage = data.featuredImage?.replace('/public', '') || '';
  const date = formatISO(endOfDay(new Date(data.date || 0)));
  const htmlBody = await marked(data?.body || '');

  const post = {
    title: data.title || '',
    featuredImage,
    body: { html: htmlBody },
    date,
    readingTime: readingTime(htmlBody),
  } as Post;

  return <BlogPost post={{ ...post }} />;
};
export default BlogPostPreview;

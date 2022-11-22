import BlogPost from 'components/blocks/BlogPost'
import type { Post } from 'contentlayer/generated'
import { formatISO, endOfDay } from 'date-fns';
import { marked } from 'marked';
import readingTime from 'reading-time';

interface BlogPostPreviewProps {
    entry: any
}

const BlogPostPreview = ({ entry }: BlogPostPreviewProps) => {
    const data = entry.getIn(['data']).toJS();

    if (!data) {
        return <div>Loading...</div>;
    }

    const featuredImage = data.featuredImage?.replace('/public', '') || '';
    const date = formatISO(endOfDay(new Date(data.date || 0)));
    const htmlBody = marked(data?.body ||'');

    const post = {
        title: data.title || '',
        featuredImage,
        body: {html: htmlBody},
        date,
        readingTime: readingTime(htmlBody)
    } as Post

    return <BlogPost post={{ ...post }} />
}
export default BlogPostPreview

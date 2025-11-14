import PageContent from 'components/blocks/PageContent';
import { endOfDay, formatISO } from 'date-fns';
import { marked } from 'marked';

interface Page {
  title: string;
  date: string;
  path?: string;
  description?: string;
  wordpress_id?: number;
  author?: string;
  comments?: boolean;
  layout?: string;
  body: { html: string };
}

interface ContentPagePreviewProps {
  entry: unknown;
}

const ContentPagePreview = ({ entry }: ContentPagePreviewProps) => {
  const data = (entry as any).getIn(['data']).toJS();

  if (!data) {
    return <div>Loading...</div>;
  }

  const date = formatISO(endOfDay(new Date(data.date || 0)));
  const htmlBody = marked(data?.body || '');

  const page = {
    title: data.title || '',
    body: { html: htmlBody },
    date,
  } as Page;

  return <PageContent page={{ ...page }} />;
};
export default ContentPagePreview;

import PageContent from 'components/blocks/PageContent'
import type { Page } from 'contentlayer/generated'
import { formatISO, endOfDay } from 'date-fns';
import { marked } from 'marked';

interface ContentPagePreviewProps {
    entry: any
}

const ContentPagePreview = ({ entry }: ContentPagePreviewProps) => {
    const data = entry.getIn(['data']).toJS();

    if (!data) {
        return <div>Loading...</div>;
    }

    const date = formatISO(endOfDay(new Date(data.date || 0)));
    const htmlBody = marked(data?.body ||'');

    const page = {
        title: data.title || '',
        body: {html: htmlBody},
        date,
    } as Page

    return <PageContent page={{ ...page }} />
}
export default ContentPagePreview

import Image from "next/image"
import DateComponent from 'components/blocks/Date';
import type { Page } from 'contentlayer/generated';
import Header from 'components/Header';

interface PageContentProps {
    page: Page
}

const PageContent = (props: PageContentProps) => {
    const { page } = props;

    return (
        <>
            <Header>
                <div className="mb-3 mt-3">
                    <h1 className='text-center font-sans font-bold text-3xl text-orange-900'>{page.title}</h1>
                    <DateComponent postDate={page.date} />
                </div>
            </Header>
            <div className='article-content leading-7 px-2' dangerouslySetInnerHTML={{ __html: page.body.html }} />
        </>
    );
}

export default PageContent;
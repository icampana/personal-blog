import Image from 'next/image'
import DateComponent from 'components/blocks/Date';
import Link from "next/link";
import type { Page } from 'contentlayer/generated';
import meta from 'metadata.json';

interface PageContentProps {
    page: Page
}

const PageContent = (props: PageContentProps) => {
    const { page } = props;
    const { site } = meta;

    return (
        <>
            <header className='px-2'>
            <div className='text-left'>
                <strong className='font-sans font-bold text-3xl mb-6'>
                <Link href={"/"}><a>{ site.title }</a></Link>
                </strong>
            </div>
            <div className="mb-3 mt-3">
                <h1 className='text-center font-sans font-bold text-3xl text-orange-900'>{page.title}</h1>
                <DateComponent postDate={page.date} />
            </div>
            </header>

            <div className='article-content leading-7 px-2' dangerouslySetInnerHTML={{ __html: page.body.html }} />
        </>
    );
}

export default PageContent;
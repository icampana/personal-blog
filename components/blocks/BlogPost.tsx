import Image from 'next/image'
import DateComponent from 'components/blocks/Date';
import Link from "next/link";
import type { Post } from 'contentlayer/generated';

import Header from 'components/Header';
import { cleanTag } from 'components/utils/text';

interface BlogPostProps {
    post: Post
}

const BlogPost = (props: BlogPostProps) => {
    const { post } = props;
    const readTime = post.readingTime?.minutes || 0;
    const readingTime = `${Math.round(readTime)} minutos`;
    const imagePath = post.featuredImage;

    const getTags = () => {
        const totalTags = post.tags?.length || 0;
        if (post.tags) {
            return <>
                <em className='text-orange-900'>Tags:</em> {post.tags.map((tag, tagIndex) => {
                    const tagSlug = cleanTag(tag);

                    return (<Link href={`/tag/${tagSlug}`} key={tagSlug}>
                        <a className='inline-block px-1'>{tag} {((tagIndex + 1) < totalTags) ? ' |' : ''}</a>
                    </Link>);
                })}
            </>;
        }
    }

    return (
        <>
            <Header>
                <div className="mb-3 mt-3">
                    <h1 className='text-center font-sans font-bold text-3xl text-orange-900'>{post.title}</h1>
                    <div className='float-right text-gray-400 text-xs'>
                        <em>Tiempo de lectura:</em> {readingTime}
                    </div>
                    <DateComponent postDate={post.date} />
                </div>
            </Header>

            {imagePath && <div className='relative mb-4 w-full h-64'>
                <Image src={imagePath} alt={post.title} layout="fill" objectFit="cover"  placeholder="blur" blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0SeuuBwADoQGm9h5VIAAAAABJRU5ErkJggg==' />
            </div>}

            <div className='article-content leading-7 px-2' dangerouslySetInnerHTML={{ __html: post.body.html }} />
            {getTags()}

        </>
    );
}

export default BlogPost;

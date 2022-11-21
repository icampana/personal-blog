import Image from 'next/image'
import DateComponent from 'components/blocks/Date';
import Link from "next/link";
import type { Post } from 'contentlayer/generated';

import Header from 'components/Header';

interface BlogPostProps {
    post: Post
}

const BlogPost = (props: BlogPostProps) => {
    const { post } = props;
    const readTime = post.readingTime?.minutes || 0;
    const readingTime = `${Math.round(readTime)} minutos`;
    const imagePath = post.featuredImage || '/images/placeholder.png';

    return (
        <>
            <Header topLevel={false}>
                <div className="mb-3 mt-3">
                    <h1 className='text-center font-sans font-bold text-3xl text-orange-900'>{post.title}</h1>
                    <div className='float-right text-gray-400 text-xs'>
                        <em>Tiempo de lectura:</em> {readingTime}
                    </div>
                    <DateComponent postDate={post.date} />
                </div>
            </Header>

            <div className='relative mb-4 w-full h-64'>
            {imagePath && <Image src={imagePath} alt={post.title} layout="fill" objectFit="cover"  placeholder="blur" blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0SeuuBwADoQGm9h5VIAAAAABJRU5ErkJggg==' />}
            </div>

            <div className='article-content leading-7 px-2' dangerouslySetInnerHTML={{ __html: post.body.html }} />
        </>
    );
}

export default BlogPost;
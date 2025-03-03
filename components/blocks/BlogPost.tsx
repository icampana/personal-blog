import React from 'react'
import Image from "next/image"
import DateComponent from 'components/blocks/Date';
import Link from "next/link";
import type { Post } from 'contentlayer/generated';

import Header from 'components/Header';
import { cleanTag } from 'components/utils/text';
import RelatedPosts from './RelatedPosts';

interface BlogPostProps {
    post: Post
    relatedPosts?: Post[]
}

const TagsList: React.FC<{ tags?: string[] }> = ({ tags }) => {
  const totalTags = tags?.length || 0;
  if (tags) {
    return (
      <>
        <em className='text-orange-900'>Tags:</em>{' '}
        {tags.map((tag, tagIndex) => {
          const tagSlug = cleanTag(tag);

          return (
            <Link href={`/tag/${tagSlug}`} key={tagSlug}>
              <span className='inline-block px-1' role='term'>
                {tag} {tagIndex + 1 < totalTags ? ' |' : ''}
              </span>
            </Link>
          );
        })}
      </>
    );
  }
  return <></>;
};

const BlogPost: React.FC<BlogPostProps> = ({ post, relatedPosts }) => {
    const readTime = post.readingTime?.minutes || 0;
    const readingTime = `${Math.round(readTime)} minutos`;
    const imagePath = post.featuredImage;

    return <>
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
            <Image
              src={imagePath}
              alt={post.title}
              placeholder="blur"
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0SeuuBwADoQGm9h5VIAAAAABJRU5ErkJggg=='
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover', overflow: 'hidden' }}
              />
        </div>}

        <div className='article-container relative'>
          <div className='article-content leading-7 px-2' dangerouslySetInnerHTML={{ __html: post.body.html }} />
          <RelatedPosts posts={relatedPosts} />
        </div>

        <TagsList tags={post.tags} />

    </>;
}

export default BlogPost;

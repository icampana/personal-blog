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

const AudioPlayer: React.FC = () => {
  if (typeof window === 'undefined') {
    return <></>;
  }

  return (
    <div itemScope itemProp="AudioObject" itemType="https://schema.org/AudioObject" className="seo">
      <meta itemProp="uploadDate" content="2024-05-02 09:05:30"/>
      <meta itemProp="name" content="ivan_Audio_Reader"/>
      <meta itemProp="description" content=""/>
      <meta itemProp="thumbnailUrl" content=" "/>
      <meta itemProp="embedUrl" content="//mowplayer.com/watch/ar-mcnaxnuduvp"/>

      <div data-mow_video="ar-mcnaxnuduvp"></div>
    </div>
  );
};

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
              fill
              sizes="100vw"
              style={{
                objectFit: "cover"
              }} />
        </div>}

        <div className='article-container relative'>
          {/* TTS Audio Player */}
          <div className='lg:float-right max-w-sm border-slate-200 border-2 min-h-[150px] ml-3 p-2'>
            <AudioPlayer />
          </div>

          <div className='article-content leading-7 px-2' dangerouslySetInnerHTML={{ __html: post.body.html }} />
          <RelatedPosts posts={relatedPosts} />
        </div>

        <TagsList tags={post.tags} />

    </>;
}

export default BlogPost;

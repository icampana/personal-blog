import React from 'react';
import type { Post } from 'contentlayer/generated';
import Link from 'next/link';

interface RelatedPostsProps {
  posts?: Post[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts = [] }) => {
  if (!posts.length) {
    return null;
  }
  return (
    <div className='border-2 p-4 border-slate-600 max-w-sm mx-auto mt-3 mb-3 trinity-skip-it'>
      <h5 className='p-0 m-0'>También te puede interesar:</h5>
      <ul>
        {posts.map((post, idx) => (
          <li key={idx} className='p-0 m-0'>
            <Link href={post.url}>
              <a>{post.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedPosts;

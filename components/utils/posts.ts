import { allPosts, Post } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

// eslint-disable-next-line no-unused-vars
export type PostFilter = (post: Post) => boolean;

export const getPostsListing = (postsFilter?: PostFilter): Post[] => {

  const filteredPosts = postsFilter ? allPosts.filter(postsFilter) : allPosts;

  return filteredPosts
    // Remove the body for the listings, it's not needed.
    .map((post) => ({ ...post, body: { raw: '', html: '' } }))
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });
}

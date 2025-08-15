
import { allPosts, Post } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

/**
 * Type for filtering posts.
 */
export type PostFilter = (post: Post) => boolean;

/**
 * Returns a sorted list of posts, optionally filtered, with body removed for listings.
 * @param postsFilter Optional filter function for posts
 */
export function getPostsListing(postsFilter?: PostFilter): Post[] {
  let posts = allPosts;
  if (postsFilter) {
    posts = posts.filter(postsFilter);
  }
  return posts
    .map((post) => ({ ...post, body: { raw: '', html: '' } }))
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
}

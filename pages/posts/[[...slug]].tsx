import Head from "next/head";
import { allPosts, Post } from "contentlayer/generated";
import BioCard from 'components/common/BioCard';
import meta from 'metadata.json';
import { NextSeo } from 'next-seo';
import { MouseEvent, useState, useEffect } from 'react';
import Footer from 'components/Footer';
import BlogPost from 'components/blocks/BlogPost';
import { compareDesc } from "date-fns";

export async function getStaticPaths() {
  const paths: string[] = allPosts.map((post) => post.url);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(props: any) {
  const { params } = props;
  const singleUrl = params.slug.join('/');

  const post: Post | undefined = allPosts.find(
    (post) => {
        if (post.path) {
            return post.path === singleUrl || (post.path === `/${singleUrl}`);
        }

        return (post._raw.flattenedPath === singleUrl || post._raw.flattenedPath === `posts/${singleUrl}`);
    }
  );

  // Return 3 related posts.
  const relatedPosts = allPosts.filter((otherPost) => {
    if (otherPost.tags && post?.tags && otherPost._id !== post._id) {
      return otherPost.tags.some(tag => post?.tags?.includes(tag));
    }
    return false;
  })
  .sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  })
  .slice(0, 3);

  return {
    props: {
      post,
      relatedPosts
    },
  };
}

const PostLayout = ({ post, relatedPosts }: { post: Post, relatedPosts?: Post[] }) => {
  const [showReturn, setShowReturn] = useState(false);
  const { site } = meta;
  let imagePath = post.featuredImage;
  const postCanonical = `${site.siteUrl}${post.url}`;
  const postDescription = post.description || post.summary;

  const backToTop = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }

  useEffect(() => {
    function onScroll() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        setShowReturn(true);
      } else {
        setShowReturn(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return function unMount() {
      window.removeEventListener("scroll", onScroll);
    };
  }), [];

  if (imagePath) {
    // Reference the optimized image so that's shown in the correct size
    const params = new URLSearchParams();
    params.set('w', '1200');
    params.set('h', '680');
    params.set('fit', 'crop');
    params.set('auto', 'format,compress');

    imagePath = `https://igcn-ws.imgix.net${imagePath}?${params.toString()}`;
  } else {
    imagePath = `${site.siteUrl}/images/placeholder.png`;
  }

  return (
    <>
      <Head>
        <title>{post.title} | { site.title }</title>
      </Head>
      <NextSeo
        title={`${post.title} | ${site.title}` }
        description={postDescription}
        canonical={postCanonical}
        openGraph={{
          url: postCanonical,
          title: post.title,
          description: postDescription,
          type: 'article',
          article: {
            publishedTime: post.date,
            modifiedTime: post.date,
            tags: post.tags,
          },
          images: [
            { url: decodeURIComponent(imagePath) },
          ],
          defaultImageWidth: 1200
        }}
        twitter={{
          handle: `@${site.social.twitter}`,
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />
      <article className="min-w-min max-w-4xl mx-auto py-8 sm:px-3">
        <BlogPost post={post} relatedPosts={relatedPosts} />

         {/* Back to top button */}
        {showReturn && <button onClick={backToTop} type="button" data-mdb-ripple="true" data-mdb-ripple-color="light" className="fixed inline-block p-3 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5" id="btn-back-to-top">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" className="w-4 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>
        </button>}
        <hr />

        <BioCard />

        <Footer />
      </article>
    </>
  );
};

export default PostLayout;

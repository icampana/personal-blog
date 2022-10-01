import Head from "next/head";
import { allPosts, Post } from "contentlayer/generated";
import BioCard from 'components/BioCard';
import meta from 'metadata.json';
import { NextSeo } from 'next-seo';
import striptags from 'striptags';
import { MouseEvent, useState, useEffect } from 'react';
import Footer from 'components/Footer';
import BlogPost from 'components/blocks/BlogPost';

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

        return (post._raw.flattenedPath === singleUrl);
    }
  );

  return {
    props: {
      post
    },
  };
}

const PostLayout = ({ post }: { post: Post }) => {
  const [showReturn, setShowReturn] = useState(false);
  const { site } = meta;
  const imagePath = post.featuredImage || '/images/placeholder.png';
  const postCanonical = `${site.siteUrl}${post.url}`;
  const postDescription = post.description || striptags(post.body.html).slice(0, 200);

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
          images: [
            { url: `${site.siteUrl}${imagePath}` },
          ],
        }}
      />
      <article className="min-w-min max-w-4xl mx-auto py-8 sm:px-3">
        <BlogPost post={post} />

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
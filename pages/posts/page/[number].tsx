import type { NextPage } from 'next'
import Head from 'next/head'
import Link from "next/link";

import PostCard from 'components/PostCard';

import { allPosts, Post } from "contentlayer/generated";
import BioCard from 'components/common/BioCard';
import meta from 'metadata.json';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { getPostsListing } from 'components/utils/posts';

export async function getStaticPaths() {
  const { posts: postsConfig } = meta;
  const totalPages = Math.round(allPosts.length / postsConfig.limit);
  const paths: string[] = Array.from({
    length: totalPages
  }, (value, index) => `/posts/page/${index + 1}`);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context: any) {
  const { posts: postsConfig } = meta;
  const currentPage = parseInt(context.params.number) || 1;
  const queryStart = (currentPage - 1) * postsConfig.limit;

  const posts: Post[] = getPostsListing();
  return {
    props: {
      posts: posts.slice(queryStart, queryStart + postsConfig.limit),
      currentPage: currentPage
    }
  };
}

const Home: NextPage<{ posts: Post[], currentPage: number}> = (props) => {
  const { site } = meta;
  const { posts, currentPage } = props;

  return (
    <div className="container mx-auto">
      <Head>
        <title>Listado de Posts - Página {currentPage} | { site.title }</title>
        <meta name="description" content={ site.description } />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='max-w-6xl mx-auto'>
        <Header />
        <h1 className='font-sans font-bold text-2xl'>
          Lista de publicaciones por fecha
        </h1>

        <BioCard />

        <div>
          <div className="mx-auto py-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <PostCard key={idx} {...post} />
            ))}
          </div>

          <div>
            {(currentPage > 1) && <Link href={`/posts/page/${currentPage - 1}`}>
              <span className="block float-left py-5 font-bold text-xl text-red-700">← Anterior</span>
            </Link>}

            <Link href={`/posts/page/${currentPage + 1}`}>
              <span className="block float-right py-5 font-bold text-xl text-red-700">Siguiente →</span>
            </Link>
            <div className='clear-both' />
          </div>

        </div>
        <Footer />
      </main>
    </div>
  )
}

export default Home

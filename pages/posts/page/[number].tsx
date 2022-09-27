import type { NextPage } from 'next'
import Head from 'next/head'
import Link from "next/link";

import PostCard from 'components/PostCard';

import { compareDesc } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";
import BioCard from 'components/BioCard';
import meta from 'metadata.json';

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

  const posts: Post[] = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });
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
        <h1 className='font-sans font-bold text-3xl hover:underline'>
          <Link href={"/"}><>Lista de publicaciones en el blog de { site.title }</></Link>
        </h1>

        <BioCard />

        <div>
          <div className="mx-auto py-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <PostCard key={idx} {...post} />
            ))}
          </div>

          <div className='h-50'>
            {(currentPage > 1) && <Link href={`/posts/page/${currentPage - 1}`}>
              <a className="block float-left py-5 font-bold text-xl text-red-700">← Anterior</a>
            </Link>}

            <Link href={`/posts/page/${currentPage + 1}`}>
              <a className="block float-right py-5 font-bold text-xl text-red-700">Siguiente →</a>
            </Link>
          </div>

        </div>
      </main>

      <footer></footer>
    </div>
  )
}

export default Home

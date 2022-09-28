import type { NextPage } from 'next'
import Head from 'next/head'
import Link from "next/link";

import PostCard from 'components/PostCard';

import { compareDesc } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";
import BioCard from 'components/BioCard';
import meta from 'metadata.json';
import Footer from 'components/Footer';

export async function getStaticProps() {
  const { posts: postsConfig } = meta;

  const posts: Post[] = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });
  return { props: { posts: posts.slice(0, postsConfig.limit) } };
}

const Home: NextPage<{ posts: Post[]}> = (props) => {
  const { site } = meta;
  const { posts } = props;
  return (
    <div className="container mx-auto">
      <Head>
        <title>Home | { site.title }</title>
        <meta name="description" content={ site.description } />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='max-w-6xl mx-auto sm:px-3'>
        <h1 className='font-sans font-bold text-5xl hover:underline'>
          <Link href={"/"}>{ site.title }</Link>
        </h1>

        <BioCard />

        <div>
          <h2 className='my-10 grow text-xl font-bold'>Últimas publicaciones</h2>
          <div className="mx-auto py-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <PostCard key={idx} {...post} />
            ))}
          </div>

          <Link href={'/posts/page/2'}>
            <a className="block justify-center py-5 font-bold text-xl text-red-700">Ver más...</a>
          </Link>

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home

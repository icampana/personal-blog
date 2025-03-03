import type { NextPage } from 'next'
import Head from 'next/head'
import Link from "next/link";

import PostCard from 'components/PostCard';

import BioCard from 'components/BioCard';
import meta from 'metadata.json';
import { NextSeo } from 'next-seo';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { getPostsListing } from 'components/utils/posts';
import { Post } from 'contentlayer/generated';

export async function getStaticProps() {
  const { posts: postsConfig } = meta;

  const posts: Post[] = getPostsListing();

  return { props: { posts: posts.slice(0, postsConfig.limit) } };
}

const Home: NextPage<{ posts: Post[]}> = (props) => {
  const { site } = meta;
  const { posts } = props;
  return (
    <div className="container mx-auto">
      <Head>
        <title>Home | { site.title }</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title={site.title}
        description={site.description}
        canonical={site.siteUrl}
      />

      <main className='max-w-6xl mx-auto'>
        <Header>
          <BioCard />
        </Header>

        <div className='px-2'>
          <h2 className='mb-2 grow'>Últimas publicaciones</h2>
          <div className="mx-auto py-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <PostCard key={idx} {...post} />
            ))}
          </div>

          <Link href={'/posts/page/2'} className="btn btn-primary">
            Ver más...
          </Link>

        </div>
        <Footer />
      </main>
    </div>
  )
}

export default Home

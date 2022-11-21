import type { NextPage } from 'next'
import Head from 'next/head'

import PostCard from 'components/PostCard';

import { compareDesc } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";
import BioCard from 'components/BioCard';
import meta from 'metadata.json';
import Footer from 'components/Footer';
import Header from 'components/Header';

const getCleanTags = (post: Post) => {
  if (post.tags) {
    return post.tags?.map(tag => tag.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  }

  return [];
}

export async function getStaticPaths() {
  const tagsList: Array<string> = allPosts.reduce((acc: Array<string>, post) => {
    getCleanTags(post).forEach(tag => {
      if (acc.indexOf(tag) === -1) {
        acc.push(tag);
      }
    });
    return acc;
  }, []);
  const paths: string[] = tagsList.map(tag => `/tag/${tag}`);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context: any) {
  const tagName = context.params.tagName;

  const posts: Post[] = allPosts.filter(post => getCleanTags(post).includes(tagName))
  .sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });
  return {
    props: {
      posts
    }
  };
}

const TagPage: NextPage<{ posts: Post[], currentPage: number}> = (props) => {
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
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default TagPage

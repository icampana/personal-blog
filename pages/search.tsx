import type { NextPage } from 'next'
import Head from 'next/head'
import Link from "next/link";

import { compareDesc } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";
import BioCard from 'components/BioCard';
import meta from 'metadata.json';
import { NextSeo } from 'next-seo';
import Footer from 'components/Footer';
import { useRouter } from 'next/router';
import React from 'react';
import DateComponent from 'components/blocks/Date';
import Fuse from 'fuse.js'

type searchResult = {
    title: string,
    url: string,
    type: string,
    date: string,
    description: string | undefined
};

const fuseOptions = { keys: ['title', 'description'], minMatchCharLength: 2, threshold: 0.3 }

export async function getStaticProps() {
  const posts: searchResult[] = allPosts.map(post => {
    return ({
        title: post.title,
        date: post.date,
        description: post.description || '',
        type: post.type,
        url: post.url,
    });
  }).sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });

  // Create the Fuse index
  const searchIndex = Fuse.createIndex(fuseOptions.keys, posts);

  return { props: { posts, searchIndex: searchIndex.toJSON() } };
}

const Search: NextPage<{ posts: Post[], searchIndex: any[]}> = (props) => {
  const { site } = meta;
  const { posts, searchIndex } = props;
  const { query } = useRouter();

  const articlesIndex = Fuse.parseIndex(searchIndex);
  // initialize Fuse with the index
  const fuse = new Fuse(posts, fuseOptions, articlesIndex)
  const searchQuery = (query && query.q) ? query.q.toString() : '';
  const searchResults = (searchQuery) ? fuse.search(searchQuery) : [];

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
        <header className='px-1'>
          <h1 className='font-sans font-bold text-5xl'>
            <Link href={"/"}><a>{ site.title }</a></Link>
          </h1>

          <BioCard />
        </header>

        <div className='px-2'>
          <h2 className='mb-2 grow text-xl font-bold'>Resultados de la búsqueda</h2>
          <div className="mx-auto grid grid-cols-2">
            {!query.q && <div>Por favor escribe el texto a buscar</div>}
            {query.q && searchResults.length === 0 && <div>No se encontró ningún resultado para esa búsqueda.</div>}
            {searchResults.length > 0 && <table className="table-auto">
            <thead>
                <tr>
                <th>Artículo</th>
                <th>Fecha de publicación</th>
                </tr>
            </thead>
            <tbody>
                {searchResults.map(({item}, idx) => (
                    <tr key={idx}>
                        <td><Link href={item.url}>{item.title}</Link></td>
                        <td><DateComponent postDate={item.date} /></td>
                    </tr>
                ))}
            </tbody>
            </table>}
          </div>

          <Link href={'/posts/page/1'}>
            <a className="block justify-center py-5 font-bold text-sm text-red-700">Ver todas las publicaciones...</a>
          </Link>

        </div>
        <Footer />
      </main>
    </div>
  )
}

export default Search

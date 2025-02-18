import type { NextPage } from 'next'
import Head from 'next/head'
import Link from "next/link";

import BioCard from 'components/BioCard';
import meta from 'metadata.json';
import { NextSeo } from 'next-seo';
import Footer from 'components/Footer';
import { useRouter } from 'next/router';
import React from 'react';
import DateComponent from 'components/blocks/Date';
import Fuse, { FuseIndexRecords } from 'fuse.js'
import Header from 'components/Header';
import { getPostsListing } from 'components/utils/posts';

type searchResult = {
    title: string,
    url: string,
    type: string,
    date: string,
    description: string | undefined
};

const fuseOptions = { keys: ['title', 'description'], minMatchCharLength: 2, threshold: 0.3 }

export async function getStaticProps() {
  const posts: searchResult[] = getPostsListing().map((post) => ({
    title: post.title,
    date: post.date,
    description: post.description || post.summary,
    type: post.type,
    url: post.url,
  }));

  // Create the Fuse index
  const searchIndex = Fuse.createIndex(fuseOptions.keys, posts);

  return { props: { posts, searchIndex: searchIndex.toJSON() } };
}

const Search: NextPage<{ posts: searchResult[], searchIndex: { keys: ReadonlyArray<string>, records: FuseIndexRecords }}> = (props) => {
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
        <Header />

        <div className='px-2'>
          <h1 className='mb-2 grow text-xl font-bold my-5'>Resultados de la búsqueda</h1>
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
                {searchResults.map(({item}, idx) => {
                    const post = (item as searchResult);
                    return (
                      <tr key={idx}>
                          <td><Link href={post.url}>{post.title}</Link></td>
                          <td><DateComponent postDate={post.date} /></td>
                      </tr>
                    );
                  }
              )}
            </tbody>
            </table>}
          </div>

          <Link href={'/posts/page/1'}>
            <a className="block justify-center text-right py-5 font-bold text-sm text-red-700">Ver todas las publicaciones...</a>
          </Link>

        </div>
        <BioCard />
        <Footer />
      </main>
    </div>
  )
}

export default Search

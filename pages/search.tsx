import Head from 'next/head'
import Link from "next/link";

import BioCard from 'components/BioCard';
import meta from 'metadata.json';
import { NextSeo } from 'next-seo';
import Footer from 'components/Footer';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import DateComponent from 'components/blocks/Date';
import Fuse, { FuseIndex } from 'fuse.js'
import Header from 'components/Header';

type searchResult = {
    title: string,
    url: string,
    type: string,
    date: string,
    description: string | undefined
};

const fuseOptions = { keys: ['title', 'description'], minMatchCharLength: 2, threshold: 0.3 }

const Search = () => {
  const { site } = meta;
  // const { posts, searchIndex } = props;
  const { query } = useRouter();
  const [ loaded, setLoaded ] = React.useState(false);
  const [ posts, setPosts ] = React.useState<searchResult[]>([]);
  const [ articlesIndex, setArticlesIndex ] = React.useState<FuseIndex<searchResult>>();

  useEffect(() => {
    async function fetchSearchIndex() {
      await fetch('/search-index.json')
      .then(res => res.json())
      .then(data => {
        const articlesIndex: FuseIndex<searchResult> = Fuse.parseIndex(data);
        setArticlesIndex(articlesIndex);
      })
    }

    async function fetchPosts() {
      await fetch('/search-posts.json')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
      })
    }

    Promise.all([fetchSearchIndex(), fetchPosts()]).then(() => {
      setLoaded(true);
    })
   }, []);

   if (!loaded || !articlesIndex) {
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
            <h1 className='mb-2 grow text-xl font-bold my-5'>Cargando...</h1>
          </div>
          <Footer />
        </main>
      </div>
    )
  }


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
          <div className="mx-auto">
            {!query.q && <div>Por favor escribe el texto a buscar</div>}
            {query.q && searchResults.length === 0 && <div>No se encontró ningún resultado para esa búsqueda.</div>}
            {searchResults.length > 0 && <table className="table-auto border-separate border border-gray-400 w-full">
            <thead>
                <tr>
                  <th className="text-left font-bold">Artículo</th>
                  <th className="text-left font-bold">Descripción</th>
                  <th className="text-right font-bold">Fecha de publicación</th>
                </tr>
            </thead>
            <tbody>
                {searchResults && searchResults.map(({item}, idx) => {
                    const post = (item as searchResult);
                    return (
                      <tr key={idx}>
                          <td width="25%"><Link href={post.url}>{post.title}</Link></td>
                          <td>{post.description}</td>
                          <td width="20%" className='text-right'><DateComponent postDate={post.date} /></td>
                      </tr>
                    );
                  }
              )}
            </tbody>
            </table>}
          </div>

          <Link href={'/posts/page/1'} className="block justify-center text-right py-5 font-bold text-sm text-red-700">
            Ver todas las publicaciones...
          </Link>

        </div>
        <BioCard />
        <Footer />
      </main>
    </div>
  )
}

export default Search

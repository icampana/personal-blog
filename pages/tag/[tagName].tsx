import type { NextPage } from 'next'
import Head from 'next/head'

import PostCard from 'components/PostCard';

import { allPosts, Post } from "contentlayer/generated";
import BioCard from 'components/BioCard';
import meta from 'metadata.json';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { NextSeo } from 'next-seo';
import { cleanTag } from 'components/utils/text';
import { getPostsListing, PostFilter } from 'components/utils/posts';

const getCleanTags = (post: Post) => {
  if (post.tags) {
    return post.tags?.map(tag => cleanTag(tag))
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

  const filterByTag: PostFilter = (post: Post) => getCleanTags(post).includes(tagName);
  const posts: Post[] = getPostsListing(filterByTag);

  return {
    props: {
      posts,
      currentTag: tagName
    }
  };
}

const TagPage: NextPage<{ posts: Post[], currentTag: string}> = (props) => {
  const { site } = meta;
  const { posts, currentTag } = props;

  const tagName = currentTag.replace('-', ' ');
  const tagTitle = `Publicaciones de ${tagName}`;
  const tagCanonical = `${site.siteUrl}/tag/${currentTag}`;
  const postImages = posts.filter(post => post.featuredImage).map(post => (
    {
      url: `${site.siteUrl}${post.featuredImage}`
    }
  )).slice(0, 5);
  const tagDescription = `Publicaciones sobre el tema ${tagName}`;

  return (
    <div className="container mx-auto">
      <Head>
        <title>Listado de publicaciones sobre: {tagName} | { site.title }</title>
        <meta name="description" content={ site.description } />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title={`${tagName} | ${site.title}` }
        description={tagDescription}
        canonical={tagCanonical}
        openGraph={{
          url: tagCanonical,
          title: tagTitle,
          description: tagDescription,
          images: postImages,
        }}
      />

      <main className='max-w-6xl mx-auto'>
        <Header>
          <h1 className='font-sans font-bold text-2xl capitalize'>Publicaciones sobre <em>{tagName}</em></h1>
        </Header>

        <div>
          <div className="mx-auto py-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <PostCard key={idx} {...post} />
            ))}
          </div>
        </div>

        <BioCard />
        <Footer />
      </main>
    </div>
  )
}

export default TagPage

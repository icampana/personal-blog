import type { NextPage } from 'next'
import Head from 'next/head'

import PostCard from 'components/PostCard';

import { allPosts, Post } from "contentlayer/generated";
import BioCard from 'components/BioCard';
import meta from 'metadata.json';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { NextSeo } from 'next-seo';
import { format } from "date-fns";
import { es } from 'date-fns/locale'
import { getPostsListing } from 'components/utils/posts';

export async function getStaticPaths() {
  const dateList: Array<string> = allPosts.reduce((acc: Array<string>, post) => {
    const postDate = format(new Date(post.date), "yyyy/MM");
    if (!acc.includes(postDate)) {
      acc.push(postDate);
    }

    return acc;
  }, []);
  const paths: string[] = dateList.map(date => `/by-date/${date}`);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context: any) {
  const dateParams = context.params.date || [];
  const [year, month] = dateParams;
  const selectedDate = `${year}/${month}`;

  const filterByDate = (post: Post) => {
    const postDate = format(new Date(post.date), "yyyy/MM");
    return (postDate === selectedDate);
  };

  const posts: Post[] = getPostsListing(filterByDate);
  return {
    props: {
      posts,
      selectedDate,
      year,
      month
    }
  };
}

const ByDatePage: NextPage<{ posts: Post[], selectedDate: string, year: string, month: string}> = (props) => {
  const { site } = meta;
  const { posts, year, month, selectedDate } = props;

  const monthWords = format(new Date(parseInt(year), parseInt(month), 1), "MMMM", { locale: es });

  const dateTitle = `Publicaciones de ${monthWords} del ${year}`;
  const tagCanonical = `${site.siteUrl}/by-date/${selectedDate}`;
  const postImages = posts.filter(post => post.featuredImage).map(post => (
    {
      url: `${site.siteUrl}${post.featuredImage}`
    }
  ));
  const tagDescription = `Publicaciones correspondientes a ${month} del ${year}`;

  return (
    <div className="container mx-auto">
      <Head>
        <title>{dateTitle} | { site.title }</title>
        <meta name="description" content={ site.description } />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title={`${dateTitle} | ${site.title}` }
        description={tagDescription}
        canonical={tagCanonical}
        openGraph={{
          url: tagCanonical,
          title: dateTitle,
          description: tagDescription,
          images: postImages,
        }}
      />

      <main className='max-w-6xl mx-auto'>
        <Header>
          <h1 className='font-sans font-bold text-2xl capitalize'>{dateTitle}</h1>
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

export default ByDatePage

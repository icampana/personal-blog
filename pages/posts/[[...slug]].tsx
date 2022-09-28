import Head from "next/head";
import Link from "next/link";
import { allPosts, Post } from "contentlayer/generated";
import Image from 'next/image'
import BioCard from 'components/BioCard';
import DateComponent from 'components/blocks/Date';
import meta from 'metadata.json';

export async function getStaticPaths() {
  const paths: string[] = allPosts.map((post) => post.url);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(props: any) {
  const { params } = props;
  const singleUrl = params.slug.join('/');

  const post: Post | undefined = allPosts.find(
    (post) => {
        if (post.path) {
            return post.path === singleUrl || (post.path === `/${singleUrl}`);
        }

        return (post._raw.flattenedPath === singleUrl);
    }
  );

  return {
    props: {
      post
    },
  };
}

const PostLayout = ({ post }: { post: Post }) => {
  const { site } = meta;
  const imagePath = post.featuredImage || '/images/placeholder.png';
  const readingTime = `${Math.round(post.readingTime.minutes)} minutos`;

  return (
    <>
      <Head>
        <title>{post.title} | { site.title }</title>
      </Head>
      <article className="min-w-min max-w-2xl mx-auto py-8">
        <div className='text-left'>
          <h1 className='font-sans font-bold text-3xl mb-6 hover:underline'>
            <Link href={"/"}>{ site.title }</Link>
          </h1>
        </div>
        <div className="text-center mb-8">
          <h1 className='font-sans font-bold text-3xl'>{post.title}</h1>
          <div className='float-right text-gray-400 text-xs'>
            <em>Tiempo de lectura:</em> {readingTime}
          </div>
          <DateComponent postDate={post.date} />
        </div>

        <div style={{ position: 'relative', width: '100%', height: '250px', marginBottom: '10px' }}>
          {imagePath && <Image src={imagePath} alt={post.title} layout="fill" objectFit="cover"  placeholder="blur" blurDataURL='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0SeuuBwADoQGm9h5VIAAAAABJRU5ErkJggg==' />}
        </div>

        <div className='leading-7' dangerouslySetInnerHTML={{ __html: post.body.html }} />
        <hr />

        <BioCard />
      </article>
    </>
  );
};

export default PostLayout;
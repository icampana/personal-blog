import Head from "next/head";
import { format, parseISO } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";
import Image from 'next/image'
import BioCard from 'components/BioCard';

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
  const featuredImage = post.featuredImage?.replace('./', '');
  const readingTime = `${Math.round(post.readingTime.minutes)} minutos`;

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article className="min-w-min max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className='font-sans font-bold text-3xl hover:underline'>{post.title}</h1>
          <div className='float-right text-gray-400 text-xs'>
            <em>Tiempo de lectura:</em> {readingTime}
          </div>
          <time dateTime={post.date} className="text-xs text-gray-600 mb-1">
            {format(parseISO(post.date), "LLLL d, yyyy")}
          </time>
        </div>

        <div>
          {post.featuredImage && <Image src={`/photos/${featuredImage}`} alt={post.title} layout="responsive" width={700} height={250} />}
        </div>

        <div className='leading-7' dangerouslySetInnerHTML={{ __html: post.body.html }} />
        <hr />

        <BioCard />
      </article>
    </>
  );
};

export default PostLayout;
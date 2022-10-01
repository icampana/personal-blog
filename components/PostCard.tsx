import type { Post } from "contentlayer/generated";
import Link from "next/link";
import DateComponent from 'components/blocks/Date';
import Image from 'next/image'
import striptags from 'striptags';

const getImage = (post: Post) => {
  const { featuredImage, title } = post;
  const imagePath = featuredImage ? featuredImage?.replace('./', '/photos/') : '/images/placeholder.png';

  return <Image src={imagePath} alt={title} layout="responsive" width={320} height={200} placeholder="blur" blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0SeuuBwADoQGm9h5VIAAAAABJRU5ErkJggg==' />
};

const PostCard = (post: Post) => {
    return (
      <div className="mb-5">
        <div>
          <Link href={post.url}><a>{getImage(post)}</a></Link>
        </div>

        <h2 className="text-xl min-h-[60px]">
          <Link href={post.url}>
            <a className="text-red-500 hover:text-blue-900">{post.title}</a>
          </Link>
        </h2>

        <DateComponent postDate={post.date} />

        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: post.description || striptags(post.body.html).slice(0, 200) }}
        />
      </div>
    );
  }

export default PostCard;
import type { Post } from "contentlayer/generated";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import Image from 'next/image'
import striptags from 'striptags';

const getImage = (post: Post) => {
  const { featuredImage, title } = post;
  const imagePath = featuredImage ? featuredImage?.replace('./', '/photos/') : '/images/placeholder.png';

  return <Image src={imagePath} alt={title} layout="responsive" width={320} height={200} placeholder="blur" />
};

const PostCard = (post: Post) => {
    return (
      <div className="mb-8">
        <div>
          <Link href={post.url}>{getImage(post)}</Link>
        </div>

        <h2 className="text-xl min-h-[60px]">
          <Link href={post.url}>
            <a className="text-red-500 hover:text-blue-900">{post.title}</a>
          </Link>
        </h2>

        <time dateTime={post.date} className="block text-xs text-gray-600 mb-2">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>

        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: post.description || striptags(post.body.html).slice(0, 200) }}
        />
      </div>
    );
  }

export default PostCard;
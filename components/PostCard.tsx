import type { Post } from "contentlayer/generated";
import Link from "next/link";
import DateComponent from 'components/blocks/Date';
import Image from "next/image"

const getImage = (post: Post) => {
  const { featuredImage, title } = post;
  const imagePath = featuredImage ? featuredImage?.replace('./', '/photos/') : '/images/placeholder.png';

  return (
    <Image
      src={imagePath}
      alt={title}
      fill
      placeholder="blur"
      blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0SeuuBwADoQGm9h5VIAAAAABJRU5ErkJggg=='
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectFit: 'cover', overflow: 'hidden' }}
    />
  );
};

const PostCard = (post: Post) => {
    const readTime = post.readingTime?.minutes || 0;
    const readingTime = `${Math.round(readTime)} minutos`;
    return (
      <div className="mb-5 mx-2 lg:mx-0">
        <div className='text-center'>
          <Link href={post.url} className="relative block h-52">{getImage(post)}</Link>
        </div>

        <h2 className="text-xl min-h-[60px]">
          <Link href={post.url}>
            <span className="text-red-500 hover:text-blue-900">{post.title}</span>
          </Link>
        </h2>

        <div className='text-xs'>
          <div className='float-right text-gray-400 text-xs'>
              <em>Lectura:</em> {readingTime}
          </div>
            <DateComponent postDate={post.date} />
        </div>

        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: post.description || post.summary + '...' }}
        />
      </div>
    );
  }

export default PostCard;

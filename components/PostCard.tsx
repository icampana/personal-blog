import type { Post } from "contentlayer/generated";
import Link from "next/link";
import DateComponent from 'components/blocks/Date';
import Image from "next/image"

const PostCard = (post: Post) => {
    const readTime = post.readingTime?.minutes || 0;
    const readingTime = `${Math.round(readTime)} minutos`;
    const imagePath = post.featuredImage ? post.featuredImage?.replace('./', '/photos/') : '/images/placeholder.png';

    return (
        <div className="card bg-base-100 shadow-xl">
            <figure>
                <Link href={post.url}>
                    <Image
                        src={imagePath}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="object-cover"
                    />
                </Link>
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    <Link href={post.url}>
                        {post.title}
                    </Link>
                </h2>
                <p>{post.description || post.summary}</p>
                <div className="card-actions justify-end">
                    {post.tags?.map((tag, idx) => (
                        <div key={idx} className="badge badge-outline">{tag}</div>
                    ))}
                </div>
                <div className="card-footer text-xs mt-4">
                    <div className="float-right">
                        <em>Lectura:</em> {readingTime}
                    </div>
                    <DateComponent postDate={post.date} />
                </div>
            </div>
        </div>
    );
}

export default PostCard;
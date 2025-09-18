import type { Post } from "contentlayer/generated";
import { format } from "date-fns";
import Link from "next/link";
import type React from "react";

interface RelatedPostsProps {
	posts?: Post[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts = [] }) => {
	if (!posts.length) {
		return null;
	}
	return (
		<div className="my-8">
			<ul className="list bg-base-100 rounded-box shadow-md">
				<li className="p-4 pb-2 text-md text-secondary tracking-wide">
					También te puede interesar
				</li>
				{posts.map((post) => (
					<li key={post.url} className="list-row">
						<div className="text-4xl text-accent font-thin opacity-30 tabular-nums">
							0{idx + 1}
						</div>
						<div className="list-col-grow">
							<Link href={post.url}>{post.title}</Link>
							<div className="text-xs uppercase font-semibold opacity-60">
								{format(new Date(post.date), "yyyy/MM")}
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default RelatedPosts;

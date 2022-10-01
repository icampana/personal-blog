import React, { useEffect, useState } from 'react'
import BlogPost from 'components/blocks/BlogPost'
import type { Post } from 'contentlayer/generated'
import { formatISO, endOfDay } from 'date-fns';
import { marked } from 'marked';

interface BlogPostPreviewProps {
    entry: any
}

const BlogPostPreview = ({ entry }: BlogPostPreviewProps) => {
    const title = entry.getIn(['data', 'title']) || '';
    const featuredImage = '';
    // const featuredImage = entry.getIn(['data', 'featuredImage']) || '';
    const content = entry.getIn(['data', 'body']) ||'';
    const date = formatISO(endOfDay(entry.getIn(['data', 'date'])));
    console.debug(entry.getIn(['data', 'featuredImage']));

    const post = {
        title,
        featuredImage,
        body: {html: marked(content)},
        date
    } as Post

    return <BlogPost post={{ ...post }} />
}
export default BlogPostPreview

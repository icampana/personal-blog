import React, { useEffect, useState } from 'react'
import BlogPost from 'components/blocks/BlogPost'
import type { Post } from 'contentlayer/generated'
import { formatISO, endOfDay } from 'date-fns';
import { marked } from 'marked';

interface BlogPostPreviewProps {
    entry: any
}

const BlogPostPreview = ({ entry }: BlogPostPreviewProps) => {
    const data = entry.getIn(['data']).toJS();

    const featuredImage = '';
    // const featuredImage = entry.getIn(['data', 'featuredImage']) || '';
    const date = formatISO(endOfDay(data.date));
    console.debug(entry.getIn(['data', 'featuredImage']));

    const post = {
        title: data.title || '',
        featuredImage,
        body: {html: marked(data?.body ||'')},
        date
    } as Post

    return <BlogPost post={{ ...post }} />
}
export default BlogPostPreview

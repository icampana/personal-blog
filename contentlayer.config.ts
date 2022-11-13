import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time';
import remarkEmoji from 'remark-emoji';
import remarkHtml from 'remark-html';

import remarkEmbedder from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    path: {
      type: 'string',
      description: 'The custom slug for the post',
      required: false,
    },
    featuredImage: {
      type: 'string',
      description: 'The hero image for the post',
      required: false,
    },
    description: {
      type: 'string',
      description: 'Simple text description',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Associated tags for this post',
      required: false
    }
  },
  computedFields: {
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
    url: {
      type: 'string',
      resolve: (doc) => {

        if (doc.path) {
          return `/posts${doc.path}`;
        }

        return `/posts/${doc._raw.flattenedPath}`;
      },
    },
  },
}))

export default makeSource({
  contentDirPath: 'content/posts',
  documentTypes: [Post],
  onExtraFieldData: 'ignore',
  markdown: { remarkPlugins: [ remarkEmbedder, remarkEmoji, remarkHtml] }
  // , {transformers: [oembedTransformer.default]}]
})
//
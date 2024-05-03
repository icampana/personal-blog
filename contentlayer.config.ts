import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import readingTime from 'reading-time';
import remarkEmoji from 'remark-emoji';
import remarkFrontmatter from 'remark-frontmatter'
import rehypeStringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { visit } from 'unist-util-visit';
import striptags from 'striptags';

// import remarkEmbedder from '@remark-embedder/core'
// import oembedTransformer from '@remark-embedder/transformer-oembed'
// import type {Config} from '@remark-embedder/transformer-oembed'

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.md`,
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

        return `/${doc._raw.flattenedPath}`;
      },
    },
    summary: { type: 'string', resolve: (doc) => striptags(doc.body.html).slice(0, 200) }
  },
}))

const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: `pages/**/*.md`,
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
    description: {
      type: 'string',
      description: 'Simple text description',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {

        if (doc.path) {
          return `/content${doc.path}`;
        }

        return `/content/${doc._raw.flattenedPath}`;
      },
    },
  },
}))

function videoPlugin(options?: any | undefined): any | void {
  const youtubeSearch = RegExp(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/);
  function transformer (tree: any) {
      visit(tree, 'paragraph', function (paragraphNode) {
        const {
          children
        } = paragraphNode;
        const node = children[0]

        if (node.type === 'link') {
          const matches = youtubeSearch.exec(node.url);
          if (matches && node.children && node.children[0].type === 'text' && node.children[0].value === node.url) {
            const videoId = matches[1];
            node.type = 'html';
            node.value = `<iframe width="320" height="240" src="https://www.youtube.com/embed/${videoId}?&autoplay=1" frameborder="0" allowfullscreen style="margin: 0 auto;"></iframe>`;
            delete node.children;
            delete node.url;
          }

        }
      });
  }

  return transformer;
}

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Page],
  onExtraFieldData: 'ignore',
  markdown: (builder) => {
    builder
      .use(remarkFrontmatter)
      .use(remarkParse)
      .use(videoPlugin)
      // .use(remarkEmbedder, {
      //   transformers: [
      //     oembedTransformer
      //   ]
      //  })
      .use(remarkGfm)
      .use(remarkBreaks)
      .use(remarkEmoji)
      .use(remark2rehype, {allowDangerousHtml: true})
      .use(rehypeStringify, {allowDangerousHtml: true})
      // .use(() => (tree: any) => {
      //   console.dir(tree.children.slice(-1)[0].children)
      // })
  }
})
//

// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkDirective from 'remark-directive';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkYoutube from './src/lib/remark-youtube.js';
import unifiedAdmonitions from './src/lib/unified-admonitions.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://ivan.campananaranjo.com',
  output: 'static',
  image: {
    domains: ['igcn-ws.imgix.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'igcn-ws.imgix.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  integrations: [react(), sitemap(), mdx()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'search-vendor': ['flexsearch'],
            'utils-vendor': ['date-fns'],
          },
        },
      },
    },
    ssr: {
      noExternal: ['date-fns'],
    },
  },
  markdown: {
    remarkPlugins: [
      remarkGfm,
      remarkBreaks,
      remarkEmoji,
      remarkDirective,
      unifiedAdmonitions,
      remarkYoutube,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeHighlight,
        {
          ignoreMissing: true,
          plainText: ['txt', 'text'],
        },
      ],
    ],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  // Content collection caching is now enabled by default in Astro 5
  redirects: {
    // WordPress login redirects
    '/wp-login.php': '/',
    '/wp-login.php/': '/',

    // Legacy pagination redirects (single digit pages)
    '/1': '/posts/page/1',
    '/2': '/posts/page/2',
    '/3': '/posts/page/3',
    '/4': '/posts/page/4',
    '/5': '/posts/page/5',
    '/6': '/posts/page/6',
    '/7': '/posts/page/7',
    '/8': '/posts/page/8',
    '/9': '/posts/page/9',
    '/10': '/posts/page/10',
    '/11': '/posts/page/11',
    '/12': '/posts/page/12',

    // Category to tag redirects (common categories)
    '/category/development': '/tag/development',
    '/category/programming': '/tag/programming',
    '/category/technology': '/tag/technology',
    '/category/javascript': '/tag/javascript',
    '/category/react': '/tag/react',
    '/category/nodejs': '/tag/nodejs',
    '/category/python': '/tag/python',
    '/category/web-development': '/tag/web-development',
    '/category/tutorial': '/tag/tutorial',
    '/category/tips': '/tag/tips',
    '/category/personal': '/tag/personal',
    '/category/entrepreneurship': '/tag/entrepreneurship',
    '/category/startup': '/tag/startup',
    '/category/remote-work': '/tag/remote-work',
    '/category/freelancing': '/tag/freelancing',
  },
});

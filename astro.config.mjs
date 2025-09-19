// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import remarkDirective from 'remark-directive';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import unifiedAdmonitions from './src/lib/unified-admonitions.js';
import remarkYoutube from './src/lib/remark-youtube.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://ivan.campananaranjo.com',
  output: 'static',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // Let DaisyUI handle base styles
    }),
    sitemap(),
    mdx()
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'search-vendor': ['fuse.js'],
            'utils-vendor': ['date-fns', 'reading-time']
          }
        }
      }
    },
    ssr: {
      noExternal: ['date-fns']
    }
  },
  markdown: {
    remarkPlugins: [
      remarkGfm,
      remarkBreaks,
      remarkEmoji,
      remarkDirective,
      unifiedAdmonitions,
      remarkYoutube
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeHighlight, {
        ignoreMissing: true,
        plainText: ['txt', 'text']
      }]
    ],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
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
  }
});

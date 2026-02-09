import fs from 'fs';
import { Document } from 'flexsearch';
import { glob } from 'glob';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLanguageFromFilename, stripLanguageSuffix } from '../src/utils/i18n.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSearchIndex() {
  try {
    console.log('🔍 Generating search index with FlexSearch...');

    // Create FlexSearch document index
    const index = new Document({
      document: {
        id: 'id',
        index: ['title', 'summary', 'content'],
        store: ['title', 'url', 'type', 'date', 'summary', 'tags']
      },
      tokenize: 'forward',
      resolution: 9,
      threshold: 1,
      depth: 3
    });

    const searchItems = [];
    let id = 0;

    // Process posts
    const postFiles = await glob('src/content/posts/**/*.md', {
      cwd: path.join(__dirname, '..'),
    });
    for (const file of postFiles) {
      const fullPath = path.join(__dirname, '..', file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { data, content: body } = matter(content);

      if (data.title) {
        const slug = path.basename(file, '.md');

        // Detect language from filename
        const locale = getLanguageFromFilename(file) || 'es';
        const cleanSlug = stripLanguageSuffix(slug);

        // Build URL with locale prefix
        const url = data.path
          ? (locale === 'es'
              ? `/posts${data.path}`
              : `/${locale}/posts${data.path}`)
          : (locale === 'es'
              ? `/posts/${cleanSlug}`
              : `/${locale}/posts/${cleanSlug}`);

        const item = {
          id: id++,
          title: data.title,
          url,
          content: body.slice(0, 500), // Limit content for search
          summary: data.description || body.slice(0, 200),
          tags: data.tags || [],
          date: data.date,
          type: 'post',
          locale, // Add locale field
        };

        index.add(item);
        searchItems.push(item);
      }
    }

    // Process pages
    const pageFiles = await glob('src/content/pages/**/*.md', {
      cwd: path.join(__dirname, '..'),
    });
    for (const file of pageFiles) {
      const fullPath = path.join(__dirname, '..', file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { data, content: body } = matter(content);

      if (data.title) {
        const slug = path.basename(file, '.md');

        // Detect language from filename
        const locale = getLanguageFromFilename(file) || 'es';
        const cleanSlug = stripLanguageSuffix(slug);

        // Build URL with locale prefix
        const url = data.path
          ? (locale === 'es'
              ? `/content${data.path}`
              : `/${locale}/content${data.path}`)
          : (locale === 'es'
              ? `/content/${cleanSlug}`
              : `/${locale}/content/${cleanSlug}`);

        const item = {
          id: id++,
          title: data.title,
          url,
          content: body.slice(0, 500),
          summary: data.description || body.slice(0, 200),
          date: data.date,
          type: 'page',
          locale,
        };

        index.add(item);
        searchItems.push(item);
      }
    }

    // Process projects
    const projectFiles = await glob('src/content/projects/**/*.md', {
      cwd: path.join(__dirname, '..'),
    });
    for (const file of projectFiles) {
      const fullPath = path.join(__dirname, '..', file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { data, content: body } = matter(content);

      if (data.title) {
        const slug = path.basename(file, '.md');

        // Detect language from filename
        const locale = getLanguageFromFilename(file) || 'es';
        const cleanSlug = stripLanguageSuffix(slug);

        // Build URL with locale prefix
        const url = data.path
          ? (locale === 'es'
              ? `/portafolio${data.path}`
              : `/${locale}/portafolio${data.path}`)
          : (locale === 'es'
              ? `/portafolio/${cleanSlug}`
              : `/${locale}/portafolio/${cleanSlug}`);

        const item = {
          id: id++,
          title: data.title,
          url,
          content: body.slice(0, 500),
          summary: data.description || body.slice(0, 200),
          tags: data.techStack || [],
          date: data.date,
          type: 'project',
          locale,
        };

        index.add(item);
        searchItems.push(item);
      }
    }

    // Export index
    const exported = {};
    index.export((key, data) => {
      exported[key] = data;
    });

    // Save the search index
    const indexPath = path.join(__dirname, '../public/search-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(exported, null, 2));
    console.log('✅ Search index generated at:', indexPath);

    // Save the posts listing for search results
    const postsPath = path.join(__dirname, '../public/search-posts.json');
    fs.writeFileSync(postsPath, JSON.stringify(searchItems, null, 2));
    console.log('✅ Search posts generated at:', postsPath);

    console.log(`📊 Indexed ${searchItems.length} items total`);
  } catch (error) {
    console.error('❌ Error generating search index:', error);
    process.exit(1);
  }
}

generateSearchIndex();

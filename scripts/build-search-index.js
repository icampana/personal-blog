import fs from 'fs';
import Fuse from 'fuse.js';
import { glob } from 'glob';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSearchIndex() {
  try {
    console.log('🔍 Generating search index...');

    const searchItems = [];

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
        const url = data.path ? `/posts${data.path}` : `/posts/${slug}`;

        searchItems.push({
          title: data.title,
          url,
          content: body.slice(0, 500), // Limit content for search
          summary: data.description || body.slice(0, 200),
          tags: data.tags || [],
          date: data.date,
          type: 'post',
        });
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
        const url = data.path ? `/content${data.path}` : `/content/${slug}`;

        searchItems.push({
          title: data.title,
          url,
          content: body.slice(0, 500),
          summary: data.description || body.slice(0, 200),
          date: data.date,
          type: 'page',
        });
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
        const url = data.path
          ? `/portafolio${data.path}`
          : `/portafolio/${slug}`;

        searchItems.push({
          title: data.title,
          url,
          content: body.slice(0, 500),
          summary: data.description || body.slice(0, 200),
          tags: data.techStack || [],
          date: data.date,
          type: 'project',
        });
      }
    }

    const fuseOptions = {
      keys: ['title', 'summary', 'content'],
      minMatchCharLength: 2,
      threshold: 0.3,
    };

    // Create the Fuse index
    const searchIndex = Fuse.createIndex(fuseOptions.keys, searchItems);

    // Save the search index
    const indexPath = path.join(__dirname, '../public/search-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(searchIndex.toJSON(), null, 2));
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

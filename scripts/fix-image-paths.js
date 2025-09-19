#!/usr/bin/env node

/**
 * Script to fix image path references in markdown files
 * Converts relative image imports to proper public path references
 */

import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content');

/**
 * Process a single markdown file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;

    // Pattern to match image imports like ![alt](./image.jpg) or ![alt](image.jpg)
    const imageImportPattern = /!\[([^\]]*)\]\(\.\/([^)]+)\)/g;

    // Pattern to match markdown image references like ![alt](image.jpg) without ./
    const relativeImagePattern =
      /!\[([^\]]*)\]\((?!http|\/|#)([^)]+\.(jpg|jpeg|png|gif|webp|svg))\)/gi;

    // Fix relative imports starting with ./
    newContent = newContent.replace(
      imageImportPattern,
      (match, alt, imagePath) => {
        console.log(`  Fixing image import: ${match}`);
        modified = true;
        return `![${alt}](/photos/${imagePath})`;
      },
    );

    // Fix relative image references without ./
    newContent = newContent.replace(
      relativeImagePattern,
      (match, alt, imagePath, ext) => {
        // Skip if it's already a proper path
        if (imagePath.startsWith('/')) {
          return match;
        }

        console.log(`  Fixing relative image: ${match}`);
        modified = true;
        return `![${alt}](/photos/${imagePath})`;
      },
    );

    // Also fix HTML img tags with relative sources
    const htmlImgPattern = /<img([^>]*)\s+src=["']\.\/([^"']+)["']([^>]*)>/gi;
    newContent = newContent.replace(
      htmlImgPattern,
      (match, beforeSrc, imagePath, afterSrc) => {
        console.log(`  Fixing HTML img tag: ${match}`);
        modified = true;
        return `<img${beforeSrc} src="/photos/${imagePath}"${afterSrc}>`;
      },
    );

    // Fix HTML img tags with relative sources (no ./)
    const htmlImgRelativePattern =
      /<img([^>]*)\s+src=["'](?!http|\/|#)([^"']+\.(jpg|jpeg|png|gif|webp|svg))["']([^>]*)>/gi;
    newContent = newContent.replace(
      htmlImgRelativePattern,
      (match, beforeSrc, imagePath, ext, afterSrc) => {
        console.log(`  Fixing HTML relative img: ${match}`);
        modified = true;
        return `<img${beforeSrc} src="/photos/${imagePath}"${afterSrc}>`;
      },
    );

    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  Fixing image path references in content files...\n');

  // Find all markdown files in content directory
  const pattern = path.join(CONTENT_DIR, '**/*.md').replace(/\\/g, '/');
  const files = await glob(pattern);

  console.log(`Found ${files.length} markdown files\n`);

  let processedCount = 0;
  let modifiedCount = 0;

  for (const file of files) {
    const relativePath = path.relative(CONTENT_DIR, file);
    console.log(`Processing: ${relativePath}`);

    const wasModified = processFile(file);
    processedCount++;

    if (wasModified) {
      modifiedCount++;
      console.log(`  ✅ Modified`);
    } else {
      console.log(`  ⏭️  No changes needed`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  Files processed: ${processedCount}`);
  console.log(`  Files modified: ${modifiedCount}`);
  console.log(`  Files unchanged: ${processedCount - modifiedCount}`);

  if (modifiedCount > 0) {
    console.log('\n🎉 Image path cleanup completed successfully!');
    console.log(
      '\n💡 Note: Make sure to copy your actual image files to the public/photos/ directory',
    );
  } else {
    console.log('\n✨ All image paths were already correct!');
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});

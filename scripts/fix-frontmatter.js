#!/usr/bin/env node

/**
 * Script to fix frontmatter issues in content files
 * This script normalizes date formats and fixes common frontmatter issues
 */

import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content');

/**
 * Fix date format in frontmatter
 */
function fixDateFormat(content) {
  let fixedContent = content;

  // Replace ISO date strings with simple YYYY-MM-DD format
  fixedContent = fixedContent.replace(
    /date:\s*(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?/g,
    'date: $1',
  );

  // Fix WordPress-style dates with timezone offset
  fixedContent = fixedContent.replace(
    /date:\s*(\d{4}-\d{2}-\d{2})\+\d{2}:\d{2}/g,
    'date: $1',
  );

  return fixedContent;
}

/**
 * Process a single markdown file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixDateFormat(content);

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✅ Fixed: ${path.relative(CONTENT_DIR, filePath)}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔧 Fixing frontmatter in content files...\n');

  // Find all markdown files in content directory
  const markdownFiles = await glob('**/*.md', {
    cwd: CONTENT_DIR,
    absolute: true,
  });

  console.log(`Found ${markdownFiles.length} markdown files\n`);

  let fixedCount = 0;

  for (const filePath of markdownFiles) {
    if (processFile(filePath)) {
      fixedCount++;
    }
  }

  console.log(`\n🎉 Fixed ${fixedCount} files`);

  if (fixedCount === 0) {
    console.log('✨ All files are already properly formatted!');
  }
}

main().catch(console.error);

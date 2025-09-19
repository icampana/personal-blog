#!/usr/bin/env node

/**
 * Content validation and migration script
 * Validates all content against schemas and checks for issues
 */

import fs from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content');
const PUBLIC_DIR = path.join(__dirname, '../public');

/**
 * Content validation results
 */
const validationResults = {
  posts: { total: 0, valid: 0, errors: [] },
  pages: { total: 0, valid: 0, errors: [] },
  projects: { total: 0, valid: 0, errors: [] },
  images: { total: 0, missing: 0, errors: [] },
  links: { total: 0, broken: 0, errors: [] },
};

/**
 * Required fields for each content type
 */
const requiredFields = {
  posts: ['title', 'date'],
  pages: ['title', 'date'],
  projects: ['title', 'date', 'description'],
};

/**
 * Validate frontmatter against schema
 */
function validateFrontmatter(data, type, filePath) {
  const errors = [];
  const required = requiredFields[type] || [];

  // Check required fields
  for (const field of required) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate date field
  if (data.date) {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      errors.push(`Invalid date format: ${data.date}`);
    }
  }

  // Validate tags (if present)
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  }

  // Validate techStack for projects (if present)
  if (type === 'projects' && data.techStack && !Array.isArray(data.techStack)) {
    errors.push('techStack must be an array');
  }

  // Validate galleryImage for projects (if present)
  if (
    type === 'projects' &&
    data.galleryImage &&
    !Array.isArray(data.galleryImage)
  ) {
    errors.push('galleryImage must be an array');
  }

  return errors;
}

/**
 * Extract image references from markdown content
 */
function extractImageReferences(content) {
  const images = [];

  // Match markdown images: ![alt](src)
  const markdownImages = content.match(/!\[.*?\]\((.*?)\)/g) || [];
  markdownImages.forEach((match) => {
    const src = match.match(/!\[.*?\]\((.*?)\)/)[1];
    if (src && !src.startsWith('http')) {
      images.push(src);
    }
  });

  // Match HTML images: <img src="...">
  const htmlImages =
    content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/g) || [];
  htmlImages.forEach((match) => {
    const src = match.match(/src=["']([^"']+)["']/)[1];
    if (src && !src.startsWith('http')) {
      images.push(src);
    }
  });

  return images;
}

/**
 * Check if image file exists
 */
function checkImageExists(imagePath) {
  // Normalize path
  let normalizedPath = imagePath;

  if (normalizedPath.startsWith('./')) {
    normalizedPath = normalizedPath.replace('./', '/photos/');
  } else if (normalizedPath.startsWith('./photos/')) {
    normalizedPath = normalizedPath.replace('./photos/', '/photos/');
  } else if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/photos/${normalizedPath}`;
  }

  const fullPath = path.join(PUBLIC_DIR, normalizedPath);
  return fs.existsSync(fullPath);
}

/**
 * Validate a single content file
 */
function validateContentFile(filePath, type) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: body } = matter(content);

    const errors = [];

    // Validate frontmatter
    const frontmatterErrors = validateFrontmatter(data, type, filePath);
    errors.push(...frontmatterErrors);

    // Check for empty content
    if (!body.trim()) {
      errors.push('Content body is empty');
    }

    // Validate images
    const images = extractImageReferences(body);
    validationResults.images.total += images.length;

    for (const image of images) {
      if (!checkImageExists(image)) {
        validationResults.images.missing++;
        errors.push(`Missing image: ${image}`);
      }
    }

    // Check featured image (if present)
    if (data.featuredImage && !checkImageExists(data.featuredImage)) {
      validationResults.images.missing++;
      errors.push(`Missing featured image: ${data.featuredImage}`);
    }

    // Check gallery images for projects
    if (type === 'projects' && data.galleryImage) {
      for (const image of data.galleryImage) {
        if (!checkImageExists(image)) {
          validationResults.images.missing++;
          errors.push(`Missing gallery image: ${image}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      data,
      body,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [`Failed to parse file: ${error.message}`],
      data: null,
      body: null,
    };
  }
}

/**
 * Validate all content files of a specific type
 */
async function validateContentType(type) {
  console.log(`\n🔍 Validating ${type}...`);

  const contentPath = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(contentPath)) {
    console.log(`❌ ${type} directory not found`);
    return;
  }

  const files = await glob('**/*.md', { cwd: contentPath });
  validationResults[type].total = files.length;

  console.log(`Found ${files.length} ${type} files`);

  for (const file of files) {
    const filePath = path.join(contentPath, file);
    const result = validateContentFile(filePath, type);

    if (result.valid) {
      validationResults[type].valid++;
    } else {
      validationResults[type].errors.push({
        file,
        errors: result.errors,
      });
    }
  }

  const validCount = validationResults[type].valid;
  const totalCount = validationResults[type].total;
  const errorCount = validationResults[type].errors.length;

  console.log(`✅ Valid: ${validCount}/${totalCount}`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} files with issues`);
  }
}

/**
 * Check for duplicate content
 */
async function checkDuplicates() {
  console.log('\n🔍 Checking for duplicate content...');

  const allPosts = await glob('**/*.md', {
    cwd: path.join(CONTENT_DIR, 'posts'),
  });
  const titles = new Map();
  const duplicates = [];

  for (const file of allPosts) {
    const filePath = path.join(CONTENT_DIR, 'posts', file);
    try {
      const { data } = matter(fs.readFileSync(filePath, 'utf8'));

      if (data.title) {
        const normalizedTitle = data.title.toLowerCase().trim();
        if (titles.has(normalizedTitle)) {
          duplicates.push({
            title: data.title,
            files: [titles.get(normalizedTitle), file],
          });
        } else {
          titles.set(normalizedTitle, file);
        }
      }
    } catch (_error) {
      // Skip files that can't be parsed
    }
  }

  if (duplicates.length > 0) {
    console.log(`⚠️  Found ${duplicates.length} potential duplicate titles:`);
    duplicates.forEach((dup) => {
      console.log(`   "${dup.title}"`);
      dup.files.forEach((file) => console.log(`     - ${file}`));
    });
  } else {
    console.log('✅ No duplicate titles found');
  }
}

/**
 * Validate internal links
 */
async function validateInternalLinks() {
  console.log('\n🔍 Validating internal links...');

  const allFiles = await glob('**/*.md', { cwd: CONTENT_DIR });
  let totalLinks = 0;
  let brokenLinks = 0;

  for (const file of allFiles) {
    const filePath = path.join(CONTENT_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { content: body } = matter(content);

      // Find internal links
      const links = body.match(/\[.*?\]\(([^)]+)\)/g) || [];

      for (const link of links) {
        const href = link.match(/\[.*?\]\(([^)]+)\)/)[1];

        // Skip external links
        if (
          href.startsWith('http') ||
          href.startsWith('//') ||
          href.startsWith('mailto:')
        ) {
          continue;
        }

        totalLinks++;

        // Check if internal link exists (simplified check)
        if (
          href.startsWith('/posts/') ||
          href.startsWith('/content/') ||
          href.startsWith('/portafolio/')
        ) {
          // These should be handled by the routing system
          continue;
        }

        // Check for relative file references
        if (href.startsWith('./') || href.startsWith('../')) {
          const resolvedPath = path.resolve(path.dirname(filePath), href);
          if (!fs.existsSync(resolvedPath)) {
            brokenLinks++;
            validationResults.links.errors.push({
              file,
              link: href,
              error: 'File not found',
            });
          }
        }
      }
    } catch (_error) {
      // Skip files that can't be parsed
    }
  }

  validationResults.links.total = totalLinks;
  validationResults.links.broken = brokenLinks;

  console.log(
    `✅ Internal links: ${totalLinks - brokenLinks}/${totalLinks} valid`,
  );
  if (brokenLinks > 0) {
    console.log(`❌ Broken links: ${brokenLinks}`);
  }
}

/**
 * Generate content statistics
 */
function generateStatistics() {
  console.log('\n📊 Content Statistics:');
  console.log('='.repeat(40));

  Object.entries(validationResults).forEach(([type, results]) => {
    if (type === 'images' || type === 'links') {
      console.log(`${type.charAt(0).toUpperCase() + type.slice(1)}:`);
      console.log(`  Total: ${results.total}`);
      if (type === 'images') {
        console.log(`  Missing: ${results.missing}`);
        console.log(`  Valid: ${results.total - results.missing}`);
      } else {
        console.log(`  Broken: ${results.broken}`);
        console.log(`  Valid: ${results.total - results.broken}`);
      }
    } else {
      console.log(`${type.charAt(0).toUpperCase() + type.slice(1)}:`);
      console.log(`  Total: ${results.total}`);
      console.log(`  Valid: ${results.valid}`);
      console.log(`  Errors: ${results.errors.length}`);
    }
    console.log('');
  });
}

/**
 * Display detailed errors
 */
function displayErrors() {
  let hasErrors = false;

  Object.entries(validationResults).forEach(([type, results]) => {
    if (results.errors && results.errors.length > 0) {
      if (!hasErrors) {
        console.log('\n❌ Detailed Errors:');
        console.log('='.repeat(40));
        hasErrors = true;
      }

      console.log(`\n${type.toUpperCase()} Errors:`);

      if (type === 'images' || type === 'links') {
        results.errors.slice(0, 10).forEach((error) => {
          console.log(`  ${error.file}: ${error.error || error.link}`);
        });
        if (results.errors.length > 10) {
          console.log(`  ... and ${results.errors.length - 10} more`);
        }
      } else {
        results.errors.slice(0, 5).forEach((error) => {
          console.log(`  ${error.file}:`);
          error.errors.forEach((err) => console.log(`    - ${err}`));
        });
        if (results.errors.length > 5) {
          console.log(
            `  ... and ${results.errors.length - 5} more files with errors`,
          );
        }
      }
    }
  });

  return hasErrors;
}

/**
 * Main validation function
 */
async function main() {
  console.log('🔍 Content Validation Starting...\n');

  // Validate each content type
  await validateContentType('posts');
  await validateContentType('pages');
  await validateContentType('projects');

  // Additional checks
  await checkDuplicates();
  await validateInternalLinks();

  // Generate statistics
  generateStatistics();

  // Display errors
  const hasErrors = displayErrors();

  // Final summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 VALIDATION SUMMARY');
  console.log('='.repeat(50));

  const totalContent =
    validationResults.posts.total +
    validationResults.pages.total +
    validationResults.projects.total;
  const validContent =
    validationResults.posts.valid +
    validationResults.pages.valid +
    validationResults.projects.valid;

  console.log(`Total Content Files: ${totalContent}`);
  console.log(`Valid Content Files: ${validContent}`);
  console.log(
    `Content Success Rate: ${Math.round((validContent / totalContent) * 100)}%`,
  );

  if (validationResults.images.total > 0) {
    const validImages =
      validationResults.images.total - validationResults.images.missing;
    console.log(
      `Image References: ${validImages}/${validationResults.images.total} valid`,
    );
  }

  if (validationResults.links.total > 0) {
    const validLinks =
      validationResults.links.total - validationResults.links.broken;
    console.log(
      `Internal Links: ${validLinks}/${validationResults.links.total} valid`,
    );
  }

  console.log('='.repeat(50));

  if (hasErrors || validContent < totalContent) {
    console.log('\n⚠️  Content validation completed with issues');
    console.log('Review the errors above and fix them before deployment');
    process.exit(1);
  } else {
    console.log('\n✅ Content validation passed! 🎉');
    console.log('All content is properly formatted and ready for deployment');
  }
}

main().catch(console.error);

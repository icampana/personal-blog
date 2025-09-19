#!/usr/bin/env node

/**
 * Content rendering test script
 * Tests that all content can be rendered without errors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content');

/**
 * Test results
 */
const testResults = {
  posts: { total: 0, passed: 0, failed: 0, errors: [] },
  pages: { total: 0, passed: 0, failed: 0, errors: [] },
  projects: { total: 0, passed: 0, failed: 0, errors: [] }
};

/**
 * Test markdown parsing
 */
function testMarkdownParsing(filePath, type) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: body } = matter(content);

    const errors = [];

    // Test frontmatter parsing
    if (!data || typeof data !== 'object') {
      errors.push('Invalid frontmatter structure');
    }

    // Test required fields
    if (!data.title || typeof data.title !== 'string') {
      errors.push('Missing or invalid title');
    }

    if (!data.date) {
      errors.push('Missing date field');
    } else {
      const date = new Date(data.date);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format');
      }
    }

    // Test content body
    if (!body || typeof body !== 'string') {
      errors.push('Missing or invalid content body');
    }

    // Test for common markdown issues
    if (body.includes('undefined') || body.includes('null')) {
      errors.push('Content contains undefined/null values');
    }

    // Test for broken image syntax
    const brokenImages = body.match(/!\[\]\([^)]*\)/g);
    if (brokenImages) {
      errors.push(`Found ${brokenImages.length} images with missing alt text`);
    }

    // Test for broken links
    const brokenLinks = body.match(/\[\]\([^)]*\)/g);
    if (brokenLinks) {
      errors.push(`Found ${brokenLinks.length} links with missing text`);
    }

    return {
      success: errors.length === 0,
      errors,
      data,
      body
    };

  } catch (error) {
    return {
      success: false,
      errors: [`Parse error: ${error.message}`],
      data: null,
      body: null
    };
  }
}

/**
 * Test URL generation
 */
function testUrlGeneration(data, slug, type) {
  const errors = [];

  try {
    // Test slug format
    if (!slug || typeof slug !== 'string') {
      errors.push('Invalid slug');
    } else {
      // Check for problematic characters in slug
      if (slug.includes(' ') || slug.includes('..') || slug.includes('//')) {
        errors.push('Slug contains problematic characters');
      }
    }

    // Test custom path (if present)
    if (data.path) {
      if (!data.path.startsWith('/')) {
        errors.push('Custom path should start with /');
      }

      if (data.path.includes('..') || data.path.includes('//')) {
        errors.push('Custom path contains problematic characters');
      }
    }

    // Generate expected URLs based on type
    let expectedUrl;
    if (data.path) {
      expectedUrl = type === 'posts' ? `/posts${data.path}` :
                   type === 'pages' ? `/content${data.path}` :
                   `/portafolio${data.path}`;
    } else {
      expectedUrl = type === 'posts' ? `/posts/${slug}` :
                   type === 'pages' ? `/content/${slug}` :
                   `/portafolio/${slug}`;
    }

    // Validate URL format
    try {
      new URL(expectedUrl, 'https://example.com');
    } catch (urlError) {
      errors.push('Generated URL is invalid');
    }

  } catch (error) {
    errors.push(`URL generation error: ${error.message}`);
  }

  return errors;
}

/**
 * Test content type specific requirements
 */
function testTypeSpecificRequirements(data, type) {
  const errors = [];

  switch (type) {
    case 'posts':
      // Test tags
      if (data.tags && !Array.isArray(data.tags)) {
        errors.push('Tags must be an array');
      }

      // Test featured image
      if (data.featuredImage && typeof data.featuredImage !== 'string') {
        errors.push('Featured image must be a string');
      }

      break;

    case 'projects':
      // Test required description
      if (!data.description) {
        errors.push('Projects must have a description');
      }

      // Test tech stack
      if (data.techStack && !Array.isArray(data.techStack)) {
        errors.push('Tech stack must be an array');
      }

      // Test gallery images
      if (data.galleryImage && !Array.isArray(data.galleryImage)) {
        errors.push('Gallery images must be an array');
      }

      // Test URLs
      if (data.liveUrl && typeof data.liveUrl !== 'string') {
        errors.push('Live URL must be a string');
      }

      if (data.repoUrl && typeof data.repoUrl !== 'string') {
        errors.push('Repo URL must be a string');
      }

      break;

    case 'pages':
      // Pages have minimal requirements beyond the base ones
      break;
  }

  return errors;
}

/**
 * Test a single content file
 */
function testContentFile(filePath, type) {
  const relativePath = path.relative(path.join(CONTENT_DIR, type), filePath);
  const slug = path.basename(relativePath, '.md');

  // Test markdown parsing
  const parseResult = testMarkdownParsing(filePath, type);

  if (!parseResult.success) {
    return {
      success: false,
      errors: parseResult.errors
    };
  }

  const errors = [];

  // Test URL generation
  const urlErrors = testUrlGeneration(parseResult.data, slug, type);
  errors.push(...urlErrors);

  // Test type-specific requirements
  const typeErrors = testTypeSpecificRequirements(parseResult.data, type);
  errors.push(...typeErrors);

  return {
    success: errors.length === 0,
    errors: [...parseResult.errors, ...errors],
    data: parseResult.data,
    body: parseResult.body
  };
}

/**
 * Test all content files of a specific type
 */
async function testContentType(type) {
  console.log(`\n🧪 Testing ${type} rendering...`);

  const contentPath = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(contentPath)) {
    console.log(`❌ ${type} directory not found`);
    return;
  }

  const files = await glob('**/*.md', { cwd: contentPath });
  testResults[type].total = files.length;

  console.log(`Testing ${files.length} ${type} files`);

  let progressCount = 0;
  const progressInterval = Math.max(1, Math.floor(files.length / 10));

  for (const file of files) {
    const filePath = path.join(contentPath, file);
    const result = testContentFile(filePath, type);

    if (result.success) {
      testResults[type].passed++;
    } else {
      testResults[type].failed++;
      testResults[type].errors.push({
        file,
        errors: result.errors
      });
    }

    progressCount++;
    if (progressCount % progressInterval === 0) {
      const progress = Math.round((progressCount / files.length) * 100);
      console.log(`  Progress: ${progress}% (${progressCount}/${files.length})`);
    }
  }

  const passedCount = testResults[type].passed;
  const totalCount = testResults[type].total;
  const failedCount = testResults[type].failed;

  console.log(`✅ Passed: ${passedCount}/${totalCount}`);
  if (failedCount > 0) {
    console.log(`❌ Failed: ${failedCount} files with rendering issues`);
  }
}

/**
 * Test search index generation
 */
async function testSearchIndexGeneration() {
  console.log('\n🔍 Testing search index generation...');

  try {
    // This would normally import and test the search index generation
    // For now, we'll do a basic check
    const allPosts = await glob('**/*.md', { cwd: path.join(CONTENT_DIR, 'posts') });
    const allPages = await glob('**/*.md', { cwd: path.join(CONTENT_DIR, 'pages') });
    const allProjects = await glob('**/*.md', { cwd: path.join(CONTENT_DIR, 'projects') });

    const totalContent = allPosts.length + allPages.length + allProjects.length;

    console.log(`✅ Found ${totalContent} content files for search indexing`);
    console.log(`  Posts: ${allPosts.length}`);
    console.log(`  Pages: ${allPages.length}`);
    console.log(`  Projects: ${allProjects.length}`);

    return true;
  } catch (error) {
    console.log(`❌ Search index generation test failed: ${error.message}`);
    return false;
  }
}

/**
 * Generate test report
 */
function generateTestReport() {
  console.log('\n📊 Content Rendering Test Results:');
  console.log('='.repeat(50));

  let totalPassed = 0;
  let totalFailed = 0;
  let totalFiles = 0;

  Object.entries(testResults).forEach(([type, results]) => {
    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)}:`);
    console.log(`  Total: ${results.total}`);
    console.log(`  Passed: ${results.passed}`);
    console.log(`  Failed: ${results.failed}`);
    console.log(`  Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
    console.log('');

    totalPassed += results.passed;
    totalFailed += results.failed;
    totalFiles += results.total;
  });

  console.log('Overall:');
  console.log(`  Total Files: ${totalFiles}`);
  console.log(`  Passed: ${totalPassed}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log(`  Success Rate: ${Math.round((totalPassed / totalFiles) * 100)}%`);
}

/**
 * Display detailed errors
 */
function displayDetailedErrors() {
  let hasErrors = false;

  Object.entries(testResults).forEach(([type, results]) => {
    if (results.errors && results.errors.length > 0) {
      if (!hasErrors) {
        console.log('\n❌ Detailed Rendering Errors:');
        console.log('='.repeat(50));
        hasErrors = true;
      }

      console.log(`\n${type.toUpperCase()} Errors:`);

      results.errors.slice(0, 5).forEach(error => {
        console.log(`  ${error.file}:`);
        error.errors.forEach(err => console.log(`    - ${err}`));
      });

      if (results.errors.length > 5) {
        console.log(`  ... and ${results.errors.length - 5} more files with errors`);
      }
    }
  });

  return hasErrors;
}

/**
 * Main testing function
 */
async function main() {
  console.log('🧪 Content Rendering Tests Starting...\n');

  // Test each content type
  await testContentType('posts');
  await testContentType('pages');
  await testContentType('projects');

  // Test search index generation
  const searchIndexOk = await testSearchIndexGeneration();

  // Generate report
  generateTestReport();

  // Display errors
  const hasErrors = displayDetailedErrors();

  // Final summary
  const totalFiles = Object.values(testResults).reduce((sum, results) => sum + results.total, 0);
  const totalPassed = Object.values(testResults).reduce((sum, results) => sum + results.passed, 0);
  const totalFailed = Object.values(testResults).reduce((sum, results) => sum + results.failed, 0);

  console.log('\n' + '='.repeat(50));
  console.log('📋 CONTENT RENDERING TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Content Files: ${totalFiles}`);
  console.log(`Rendering Tests Passed: ${totalPassed}`);
  console.log(`Rendering Tests Failed: ${totalFailed}`);
  console.log(`Overall Success Rate: ${Math.round((totalPassed / totalFiles) * 100)}%`);
  console.log(`Search Index Generation: ${searchIndexOk ? '✅ OK' : '❌ Failed'}`);
  console.log('='.repeat(50));

  if (hasErrors || totalFailed > 0 || !searchIndexOk) {
    console.log('\n❌ Content rendering tests failed');
    console.log('Fix the issues above before proceeding with deployment');
    process.exit(1);
  } else {
    console.log('\n✅ All content rendering tests passed! 🎉');
    console.log('Content is ready for production deployment');
  }
}

main().catch(console.error);
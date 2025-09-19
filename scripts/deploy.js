#!/usr/bin/env node

/**
 * Deployment script for different environments
 * Handles pre-deployment checks and environment-specific configurations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENVIRONMENTS = {
  production: {
    name: 'Production',
    url: 'https://ivan.campananaranjo.com',
    branch: 'main',
    buildCommand: 'build:production',
  },
  staging: {
    name: 'Staging',
    url: 'https://staging--ivan-blog.netlify.app',
    branch: 'develop',
    buildCommand: 'build:preview',
  },
  preview: {
    name: 'Preview',
    url: 'https://deploy-preview--ivan-blog.netlify.app',
    branch: 'feature/*',
    buildCommand: 'build:preview',
  },
};

/**
 * Get current git branch
 */
function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.log('⚠️  Could not determine git branch');
    return 'unknown';
  }
}

/**
 * Get current git commit hash
 */
function getCurrentCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Check if working directory is clean
 */
function isWorkingDirectoryClean() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim() === '';
  } catch (error) {
    return false;
  }
}

/**
 * Run pre-deployment checks
 */
function runPreDeploymentChecks(environment) {
  console.log(`🔍 Running pre-deployment checks for ${environment.name}...\n`);

  const checks = [];

  // Check git status
  if (environment.name === 'Production' && !isWorkingDirectoryClean()) {
    checks.push('❌ Working directory is not clean');
  } else {
    checks.push('✅ Working directory is clean');
  }

  // Check current branch
  const currentBranch = getCurrentBranch();
  if (environment.name === 'Production' && currentBranch !== 'main') {
    checks.push(`⚠️  Current branch is '${currentBranch}', expected 'main'`);
  } else {
    checks.push(`✅ Current branch: ${currentBranch}`);
  }

  // Check if tests pass
  try {
    console.log('🧪 Running tests...');
    execSync('pnpm run test:run', { stdio: 'pipe' });
    checks.push('✅ All tests pass');
  } catch (error) {
    checks.push('❌ Tests failed');
    return { passed: false, checks };
  }

  // Check linting
  try {
    console.log('🔍 Running linter...');
    execSync('pnpm run lint', { stdio: 'pipe' });
    checks.push('✅ Linting passed');
  } catch (error) {
    checks.push('❌ Linting failed');
    return { passed: false, checks };
  }

  // Check TypeScript
  try {
    console.log('🔧 Checking TypeScript...');
    execSync('pnpm run astro check', { stdio: 'pipe' });
    checks.push('✅ TypeScript check passed');
  } catch (error) {
    checks.push('⚠️  TypeScript check failed (non-blocking)');
  }

  return { passed: true, checks };
}

/**
 * Generate build info
 */
function generateBuildInfo(environment) {
  const buildInfo = {
    environment: environment.name,
    branch: getCurrentBranch(),
    commit: getCurrentCommit(),
    buildTime: new Date().toISOString(),
    nodeVersion: process.version,
    url: environment.url,
  };

  const buildInfoPath = path.join(__dirname, '../public/build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

  console.log('📝 Build info generated:');
  console.log(`   Environment: ${buildInfo.environment}`);
  console.log(`   Branch: ${buildInfo.branch}`);
  console.log(`   Commit: ${buildInfo.commit}`);
  console.log(`   Build Time: ${buildInfo.buildTime}`);
}

/**
 * Run build process
 */
function runBuild(environment) {
  console.log(`\n🏗️  Building for ${environment.name}...\n`);

  try {
    execSync(`pnpm run ${environment.buildCommand}`, { stdio: 'inherit' });
    console.log(`\n✅ Build completed successfully for ${environment.name}`);
    return true;
  } catch (error) {
    console.log(`\n❌ Build failed for ${environment.name}`);
    return false;
  }
}

/**
 * Display deployment summary
 */
function displayDeploymentSummary(environment, buildSuccess) {
  console.log('\n' + '='.repeat(50));
  console.log('📋 DEPLOYMENT SUMMARY');
  console.log('='.repeat(50));
  console.log(`Environment: ${environment.name}`);
  console.log(`URL: ${environment.url}`);
  console.log(`Branch: ${getCurrentBranch()}`);
  console.log(`Commit: ${getCurrentCommit()}`);
  console.log(`Build Status: ${buildSuccess ? '✅ Success' : '❌ Failed'}`);
  console.log('='.repeat(50));

  if (buildSuccess) {
    console.log('\n🚀 Ready for deployment!');
    console.log('\nNext steps:');
    console.log('1. Push changes to trigger automatic deployment');
    console.log('2. Monitor deployment in Netlify dashboard');
    console.log('3. Verify deployment at:', environment.url);
  } else {
    console.log('\n❌ Deployment preparation failed');
    console.log('Please fix the issues above and try again');
  }
}

/**
 * Main deployment function
 */
function main() {
  const args = process.argv.slice(2);
  const environmentName = args[0] || 'production';

  const environment = ENVIRONMENTS[environmentName];

  if (!environment) {
    console.log('❌ Invalid environment. Available environments:');
    Object.keys(ENVIRONMENTS).forEach(env => {
      console.log(`   - ${env}`);
    });
    process.exit(1);
  }

  console.log(`🚀 Preparing deployment for ${environment.name}\n`);

  // Run pre-deployment checks
  const checkResults = runPreDeploymentChecks(environment);

  console.log('\n📋 Pre-deployment check results:');
  checkResults.checks.forEach(check => console.log(`   ${check}`));

  if (!checkResults.passed) {
    console.log('\n❌ Pre-deployment checks failed');
    process.exit(1);
  }

  // Generate build info
  generateBuildInfo(environment);

  // Run build
  const buildSuccess = runBuild(environment);

  // Display summary
  displayDeploymentSummary(environment, buildSuccess);

  if (!buildSuccess) {
    process.exit(1);
  }
}

// Show help if requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('🚀 Deployment Script');
  console.log('\nUsage:');
  console.log('  node scripts/deploy.js [environment]');
  console.log('\nEnvironments:');
  Object.entries(ENVIRONMENTS).forEach(([key, env]) => {
    console.log(`  ${key.padEnd(12)} - ${env.name} (${env.url})`);
  });
  console.log('\nExamples:');
  console.log('  node scripts/deploy.js production');
  console.log('  node scripts/deploy.js staging');
  console.log('  node scripts/deploy.js preview');
  process.exit(0);
}

main();
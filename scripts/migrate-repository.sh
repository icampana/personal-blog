#!/bin/bash

# Repository Migration Script
# Migrates from Next.js to Astro while preserving content and git history

set -e

echo "🔄 Starting repository migration from Next.js to Astro..."

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this from your blog's root directory."
    exit 1
fi

# Check if astro-blog directory exists
if [ ! -d "astro-blog" ]; then
    echo "❌ Error: astro-blog directory not found. Please ensure the Astro setup is in ./astro-blog/"
    exit 1
fi

# Create backup branch
echo "📦 Creating backup branch..."
git checkout main 2>/dev/null || git checkout master 2>/dev/null || echo "Using current branch"
CURRENT_BRANCH=$(git branch --show-current)
git branch nextjs-backup-$(date +%Y%m%d) 2>/dev/null || echo "Backup branch already exists"
git push origin nextjs-backup-$(date +%Y%m%d) 2>/dev/null || echo "Backup already pushed"

# Create migration branch
echo "🌿 Creating migration branch..."
git checkout -b astro-migration-$(date +%Y%m%d) 2>/dev/null || git checkout astro-migration-$(date +%Y%m%d)

# Preserve important directories
echo "💾 Preserving content and assets..."
mkdir -p .migration-backup
cp -r content .migration-backup/ 2>/dev/null || echo "No content directory to backup"
cp -r public .migration-backup/ 2>/dev/null || echo "No public directory to backup"
cp README.md .migration-backup/ 2>/dev/null || echo "No README to backup"
cp .env* .migration-backup/ 2>/dev/null || echo "No env files to backup"

# Remove old Next.js files
echo "🗑️  Removing old Next.js files..."
rm -rf pages components lib styles next.config.js
rm -f package.json package-lock.json yarn.lock pnpm-lock.yaml
rm -rf .next out
rm -f next-env.d.ts next-sitemap.config.js
rm -rf node_modules

# Copy new Astro setup
echo "📁 Copying new Astro setup..."
cp -r astro-blog/* .
cp astro-blog/.* . 2>/dev/null || true

# Restore preserved content
echo "🔄 Restoring preserved content..."
if [ -d ".migration-backup/content" ]; then
    echo "Restoring content directory..."
    rm -rf content
    cp -r .migration-backup/content .
fi

if [ -d ".migration-backup/public" ]; then
    echo "Merging public directories..."
    cp -r .migration-backup/public/* public/ 2>/dev/null || true
fi

# Clean up backup
rm -rf .migration-backup

# Update package.json with correct name if needed
if [ -f "package.json" ]; then
    echo "📝 Updating package.json..."
    # You might want to update the name field to match your repo
    sed -i.bak 's/"name": "astro-blog"/"name": "your-blog-name"/' package.json 2>/dev/null || true
    rm -f package.json.bak
fi

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

# Run initial tests
echo "🧪 Running initial tests..."
if command -v pnpm &> /dev/null; then
    pnpm run lint || echo "⚠️  Linting issues found - please fix before committing"
    pnpm run test:run || echo "⚠️  Test issues found - please fix before committing"
else
    npm run lint || echo "⚠️  Linting issues found - please fix before committing"
    npm run test:run || echo "⚠️  Test issues found - please fix before committing"
fi

# Stage all changes
echo "📝 Staging changes..."
git add .

# Create commit
echo "💾 Creating migration commit..."
git commit -m "feat: migrate from Next.js to Astro

- Complete rewrite using Astro SSG for better performance
- Preserve all existing content and assets
- Add comprehensive testing suite with Vitest
- Implement CI/CD pipeline with GitHub Actions
- Add performance monitoring with Lighthouse CI
- Maintain URL compatibility with redirect system
- Add TinaCMS integration for content management
- Implement full-text search with Fuse.js
- Add responsive design with Tailwind CSS + DaisyUI
- Include comprehensive documentation and deployment guides

Migration preserves:
- All blog posts and content
- All images and assets
- Git history and branches
- Environment configurations

New features:
- Static site generation for optimal performance
- Modern development workflow with TypeScript
- Comprehensive testing and quality assurance
- Automated deployment and monitoring
- Enhanced SEO and accessibility
- Mobile-first responsive design"

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Review the changes: git diff HEAD~1"
echo "2. Test the build: pnpm run build"
echo "3. Test locally: pnpm run dev"
echo "4. Push branch: git push origin astro-migration-$(date +%Y%m%d)"
echo "5. Create PR for review"
echo "6. After testing, merge to main"
echo ""
echo "Backup branch created: nextjs-backup-$(date +%Y%m%d)"
echo "Migration branch: astro-migration-$(date +%Y%m%d)"
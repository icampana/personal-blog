# Deployment Guide

This document outlines the deployment process for the Astro blog migration.

## Overview

The blog uses a modern CI/CD pipeline with the following components:

- **Build System**: Astro with Vite
- **Package Manager**: pnpm
- **Hosting**: Netlify
- **CI/CD**: GitHub Actions
- **Testing**: Vitest
- **Performance Monitoring**: Lighthouse CI

## Environments

### Production
- **URL**: https://ivan.campananaranjo.com
- **Branch**: `main`
- **Auto-deploy**: Yes (on push to main)
- **Build Command**: `pnpm run build:production`

### Staging
- **URL**: https://staging--ivan-blog.netlify.app
- **Branch**: `develop`
- **Auto-deploy**: Yes (on push to develop)
- **Build Command**: `pnpm run build:preview`

### Preview
- **URL**: Deploy previews for PRs
- **Branch**: Any feature branch
- **Auto-deploy**: Yes (on PR creation/update)
- **Build Command**: `pnpm run build:preview`

## Build Process

### 1. Pre-build Steps
```bash
pnpm run prebuild
```
- Runs linting (`pnpm run lint`)
- Runs tests (`pnpm run test:run`)

### 2. Build Steps
```bash
pnpm run build:production
```
- Builds TinaCMS (`tinacms build`)
- Generates search index (`node scripts/build-search-index.js`)
- Builds Astro site (`astro build`)

### 3. Post-build Steps
```bash
pnpm run postbuild
```
- Verifies build output (`pnpm run build:verify`)

## Manual Deployment

### Prerequisites
- Node.js 20+
- pnpm 9+
- Git repository access

### Local Build
```bash
# Install dependencies
pnpm install

# Run full production build
pnpm run build:production

# Verify build
pnpm run build:verify

# Preview locally
pnpm run preview
```

### Deploy to Staging
```bash
pnpm run deploy:staging
```

### Deploy to Production
```bash
pnpm run deploy:production
```

## Automated Deployment

### GitHub Actions Workflow

The CI/CD pipeline runs on:
- **Push to main**: Full production deployment
- **Push to develop**: Staging deployment
- **Pull requests**: Preview deployment + tests

#### Pipeline Steps:
1. **Test Job**
   - Linting
   - TypeScript checking
   - Unit tests
   - Coverage reporting

2. **Build Job**
   - Production build
   - Build verification
   - Artifact upload

3. **Security Job**
   - Vulnerability scanning
   - SARIF report upload

4. **Lighthouse Job** (PR only)
   - Performance testing
   - Accessibility checks
   - SEO validation

5. **Deploy Job**
   - Environment-specific deployment
   - Success notifications

### Required Secrets

Set these in GitHub repository secrets:

```
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id
LHCI_GITHUB_APP_TOKEN=your_lighthouse_token (optional)
```

## Netlify Configuration

### Build Settings
- **Build command**: `pnpm run build`
- **Publish directory**: `dist`
- **Node version**: 20

### Environment Variables
```
NODE_VERSION=20
PNPM_VERSION=9
PUBLIC_SITE_URL=https://ivan.campananaranjo.com
```

### Redirects & Headers
Configured in `netlify.toml`:
- Legacy URL redirects (WordPress/Gatsby)
- Security headers
- Cache optimization
- SPA fallbacks

## Performance Optimization

### Build Optimization
- **Bundle splitting**: Automatic via Astro
- **Image optimization**: Responsive images with lazy loading
- **CSS optimization**: Tailwind purging + minification
- **JS optimization**: Tree shaking + minification

### Runtime Optimization
- **CDN**: Netlify Edge Network
- **Caching**: Aggressive caching for static assets
- **Compression**: Gzip/Brotli compression
- **Preloading**: Critical resources preloaded

### Performance Targets
- **Lighthouse Performance**: >80
- **Lighthouse Accessibility**: >90
- **Lighthouse SEO**: >90
- **First Contentful Paint**: <2s
- **Largest Contentful Paint**: <3s

## Monitoring & Alerts

### Build Monitoring
- GitHub Actions notifications
- Netlify deploy notifications
- Build failure alerts

### Performance Monitoring
- Lighthouse CI reports
- Core Web Vitals tracking
- Error monitoring (optional)

### Health Checks
- Automated build verification
- Critical page availability
- Search functionality
- RSS feed validation

## Rollback Procedure

### Automatic Rollback
Netlify provides instant rollback via dashboard:
1. Go to Netlify dashboard
2. Select previous deployment
3. Click "Publish deploy"

### Manual Rollback
```bash
# Revert to previous commit
git revert HEAD

# Push to trigger new deployment
git push origin main
```

## Troubleshooting

### Common Build Issues

#### 1. TypeScript Errors
```bash
# Check TypeScript issues
pnpm run astro check

# Fix and rebuild
pnpm run build
```

#### 2. Test Failures
```bash
# Run tests locally
pnpm run test

# Run specific test
pnpm run test -- search.test.ts
```

#### 3. Build Verification Failures
```bash
# Check build output
pnpm run build:verify

# Inspect dist directory
ls -la dist/
```

#### 4. Search Index Issues
```bash
# Rebuild search index
pnpm run build:index

# Verify search data
cat public/search-index.json | jq length
```

### Performance Issues

#### 1. Large Bundle Size
- Check bundle analyzer output
- Review dynamic imports
- Optimize images and assets

#### 2. Slow Build Times
- Clear build cache
- Check dependency updates
- Optimize content processing

## Security Considerations

### Build Security
- Dependency vulnerability scanning
- Secrets management
- Environment isolation

### Runtime Security
- CSP headers
- HTTPS enforcement
- XSS protection
- CSRF protection

### Content Security
- Input sanitization
- Markdown processing security
- Image upload restrictions

## Maintenance

### Regular Tasks
- **Weekly**: Dependency updates
- **Monthly**: Performance review
- **Quarterly**: Security audit

### Update Procedures
```bash
# Update dependencies
pnpm update

# Update Astro
pnpm add astro@latest

# Test updates
pnpm run test
pnpm run build
```

## Support

For deployment issues:
1. Check GitHub Actions logs
2. Review Netlify deploy logs
3. Verify environment configuration
4. Test locally with production build

For urgent issues:
- Use Netlify rollback feature
- Contact team via established channels
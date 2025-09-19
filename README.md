# Iván Gabriel's Blog - Astro Migration

A modern, high-performance blog built with Astro, migrated from Next.js with comprehensive content management and optimization features.

## 🚀 Features

### Core Features
- **Static Site Generation** with Astro for optimal performance
- **370+ Blog Posts** spanning 20+ years of content (2004-2025)
- **Portfolio Projects** with image galleries and tech stack details
- **Full-Text Search** powered by Fuse.js with pre-built indexes
- **Responsive Design** optimized for all devices
- **Dark/Light Theme** with system preference detection

### Content Management
- **Content Collections** with Zod schema validation
- **TinaCMS Integration** for visual content editing
- **Markdown Processing** with syntax highlighting and custom directives
- **Image Optimization** with responsive images and lazy loading
- **SEO Optimization** with structured data and meta tags

### Performance Optimizations
- **Bundle Splitting** for optimal loading
- **Image Optimization** with WebP/AVIF support
- **Lazy Loading** for images and components
- **Preloading** for critical resources
- **Compression** with gzip/brotli support

### Developer Experience
- **TypeScript** for type safety
- **Tailwind CSS** with DaisyUI components
- **Comprehensive Testing** with Vitest and Testing Library
- **CI/CD Pipeline** with GitHub Actions
- **Performance Monitoring** with Lighthouse CI

## 📁 Project Structure

```
astro-blog/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── SearchComponent.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── PostCard.astro
│   │   └── ...
│   ├── content/            # Content collections
│   │   ├── posts/          # Blog posts (370+ files)
│   │   ├── pages/          # Static pages
│   │   ├── projects/       # Portfolio projects
│   │   └── config.ts       # Content schemas
│   ├── layouts/            # Page layouts
│   │   ├── BaseLayout.astro
│   │   ├── BlogLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/              # File-based routing
│   │   ├── posts/          # Blog post routes
│   │   ├── tag/            # Tag-based filtering
│   │   └── search.astro    # Search functionality
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   └── test/               # Test suites
├── public/                 # Static assets
│   ├── images/             # Optimized images
│   └── photos/             # Content images
├── scripts/                # Build and deployment scripts
├── .github/workflows/      # CI/CD configuration
└── docs/                   # Documentation
```

## 🛠️ Development

### Prerequisites
- Node.js 20+
- pnpm 9+

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd astro-blog

# Install dependencies
pnpm install
```

### Development Server
```bash
# Start development server with TinaCMS
pnpm run dev

# Start Astro only
pnpm run astro dev
```

### Building
```bash
# Production build
pnpm run build

# Preview build
pnpm run build:preview

# Verify build
pnpm run build:verify
```

## 🧪 Testing

### Test Suites
```bash
# Unit tests
pnpm run test

# Content validation
pnpm run validate:content

# Performance analysis
pnpm run test:performance

# Mobile responsiveness
pnpm run test:mobile

# Comprehensive final tests
pnpm run test:final
```

### Test Coverage
- **Unit Tests**: Components, utilities, and business logic
- **Integration Tests**: Content collections, routing, search
- **Performance Tests**: Bundle analysis, optimization checks
- **Accessibility Tests**: WCAG compliance, mobile responsiveness
- **Content Tests**: Validation, rendering, link checking

## 📝 Content Management

### Content Types

#### Blog Posts (`src/content/posts/`)
```yaml
---
title: "Post Title"
date: 2023-01-15
description: "Post description"
featuredImage: "/photos/image.jpg"
tags: ["tag1", "tag2"]
---
```

#### Pages (`src/content/pages/`)
```yaml
---
title: "Page Title"
date: 2023-01-15
description: "Page description"
---
```

#### Projects (`src/content/projects/`)
```yaml
---
title: "Project Title"
date: 2023-01-15
description: "Project description"
techStack: ["React", "TypeScript"]
galleryImage: ["/photos/project1.jpg"]
liveUrl: "https://example.com"
repoUrl: "https://github.com/user/repo"
---
```

### Content Scripts
```bash
# Migrate content from Next.js
pnpm run migrate:content

# Validate all content
pnpm run validate:content

# Test content rendering
pnpm run test:content

# Fix frontmatter issues
pnpm run fix:frontmatter
```

## 🚀 Deployment

### Environments
- **Production**: https://ivan.campananaranjo.com
- **Staging**: https://staging--ivan-blog.netlify.app
- **Preview**: Deploy previews for PRs

### Deployment Commands
```bash
# Deploy to production
pnpm run deploy

# Deploy to staging
pnpm run deploy:staging

# Deploy preview
pnpm run deploy:preview
```

### CI/CD Pipeline
- **Automated Testing**: Linting, TypeScript, unit tests
- **Build Verification**: Bundle analysis, performance checks
- **Security Scanning**: Vulnerability detection
- **Performance Testing**: Lighthouse CI
- **Automated Deployment**: Production and staging environments

## 📊 Performance

### Optimization Features
- **Bundle Splitting**: Vendor chunks for better caching
- **Image Optimization**: Responsive images with lazy loading
- **Code Splitting**: Dynamic imports for non-critical code
- **Asset Optimization**: Minification and compression
- **Caching Strategy**: Long-term caching for static assets

### Performance Targets
- **Lighthouse Performance**: >90
- **First Contentful Paint**: <2.5s
- **Largest Contentful Paint**: <2.5s
- **Bundle Size**: <5MB total
- **JavaScript Bundle**: <2MB

## 🔍 Search

### Search Features
- **Full-Text Search** across all content types
- **Fuzzy Matching** for typo tolerance
- **Tag-Based Filtering** for content discovery
- **Search Highlighting** for result context
- **Performance Optimized** with pre-built indexes

### Search Implementation
- **Fuse.js** for client-side search
- **Pre-built Indexes** generated at build time
- **React Islands** for interactive search UI
- **Debounced Input** for performance
- **Keyboard Navigation** support

## 🎨 Styling

### Design System
- **Tailwind CSS** for utility-first styling
- **DaisyUI** for component library
- **Responsive Design** with mobile-first approach
- **Dark/Light Themes** with system preference
- **Custom Components** for blog-specific needs

### Theme Configuration
- **29 DaisyUI Themes** available
- **System Preference Detection**
- **Theme Persistence** across sessions
- **Smooth Transitions** between themes

## 🔧 Configuration

### Environment Variables
```bash
# Site configuration
PUBLIC_SITE_URL=https://ivan.campananaranjo.com
PUBLIC_SITE_NAME="Iván Gabriel"

# TinaCMS
TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_token

# Analytics (optional)
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Build Configuration
- **Astro Config**: `astro.config.mjs`
- **Tailwind Config**: `tailwind.config.js`
- **TypeScript Config**: `tsconfig.json`
- **Netlify Config**: `netlify.toml`

## 📚 Documentation

### Available Docs
- **[Deployment Guide](DEPLOYMENT.md)**: Complete deployment procedures
- **[Content Migration](CONTENT_MIGRATION.md)**: Content migration process
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)**: Pre-deployment validation
- **[Test Documentation](src/test/README.md)**: Testing procedures

### API Documentation
- **Content Collections**: Zod schemas and validation
- **Utility Functions**: Helper functions and utilities
- **Component Props**: TypeScript interfaces
- **Search API**: Search functionality and indexes

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm run test:final`
5. Submit a pull request

### Code Standards
- **TypeScript** for type safety
- **ESLint + Biome** for code quality
- **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Test Coverage** for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Astro Team** for the amazing static site generator
- **Tailwind CSS** for the utility-first CSS framework
- **DaisyUI** for the beautiful component library
- **TinaCMS** for the headless CMS integration
- **Netlify** for hosting and deployment

---

**Built with ❤️ using Astro, TypeScript, and modern web technologies.**
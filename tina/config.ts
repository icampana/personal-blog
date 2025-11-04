import { defineConfig } from 'tinacms';
import { pagesFields, postsFields, projectFields } from './templates';

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

const config: any = {
  branch,
  clientId: 'da403933-32db-4dcf-b799-ebc141c1fd51', // Get this from tina.io
  token: 'd34d778eb69b883ddc7b48c0757e4bfa7999ec25', // Get this from tina.io
  client: { skip: true },
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'photos',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        format: 'md',
        label: 'Posts',
        name: 'posts',
        path: 'src/content/posts',
        match: {
          include: '**/*',
        },
        ui: {
          router: (props) => {
            // Enable visual editing by routing to the post page
            if (props.document._sys?.breadcrumbs) {
              const slug = props.document._sys.breadcrumbs
                .join('/')
                .replace(/\.md$/, '');
              return `/posts/${slug}`;
            }
            if (props.document._sys?.filename) {
              const slug = props.document._sys.filename.replace(/\.md$/, '');
              return `/posts/${slug}`;
            }
            if (props.document._sys?.relativePath) {
              const slug = props.document._sys.relativePath.replace(
                /\.md$/,
                '',
              );
              return `/posts/${slug}`;
            }
            return undefined;
          },
          filename: {
            // Example of using a custom slugify function
            slugify: (values) => {
              const articleDate = values?.date
                ? new Date(values?.date)
                : new Date();

              // Values is an object containing all the values of the form. In this case it is {title?: string, topic?: string}
              return `${articleDate.getFullYear()}-${articleDate.getMonth() + 1}-${values?.title
                ?.toLowerCase()
                .replace(/ /g, '-')}`;
            },
          },
        },
        fields: [
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body of Document',
            description: 'This is the markdown body',
            isBody: true,
          },
          ...postsFields(),
        ],
      },
      {
        format: 'md',
        label: 'Pages',
        name: 'pages',
        path: 'src/content/pages',
        match: {
          include: '**/*',
        },
        ui: {
          router: (props) => {
            // Enable visual editing by routing to the page
            if (props.document._sys?.breadcrumbs) {
              const slug = props.document._sys.breadcrumbs
                .join('/')
                .replace(/\.md$/, '');
              return `/${slug}`;
            }
            if (props.document._sys?.filename) {
              const slug = props.document._sys.filename.replace(/\.md$/, '');
              return `/${slug}`;
            }
            if (props.document._sys?.relativePath) {
              const slug = props.document._sys.relativePath.replace(
                /\.md$/,
                '',
              );
              return `/${slug}`;
            }
            return undefined;
          },
        },
        fields: [
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body of Document',
            description: 'This is the markdown body',
            isBody: true,
          },
          ...pagesFields(),
        ],
      },
      {
        format: 'md',
        label: 'Projects',
        name: 'projects',
        path: 'src/content/projects',
        match: {
          include: '**/*',
        },
        ui: {
          router: (props) => {
            // Enable visual editing by routing to the project page
            if (props.document._sys?.breadcrumbs) {
              const slug = props.document._sys.breadcrumbs
                .join('/')
                .replace(/\.md$/, '');
              return `/portafolio/${slug}`;
            }
            if (props.document._sys?.filename) {
              const slug = props.document._sys.filename.replace(/\.md$/, '');
              return `/portafolio/${slug}`;
            }
            if (props.document._sys?.relativePath) {
              const slug = props.document._sys.relativePath.replace(
                /\.md$/,
                '',
              );
              return `/portafolio/${slug}`;
            }
            return undefined;
          },
        },
        fields: [
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body of Document',
            description: 'This is the markdown body',
            isBody: true,
          },
          ...projectFields(),
        ],
      },
    ],
  },
};

// Add cmsCallback only in development to avoid schema mismatch in production
if (isDev) {
  config.cmsCallback = (cms) => {
    import('tinacms').then(({ RouteMappingPlugin }) => {
      const RouteMapping = new RouteMappingPlugin((collection, document) => {
        if (['posts', 'pages', 'projects'].includes(collection.name)) {
          // Extract slug from filename - use multiple fallback methods
          let slug = '';

          // Try breadcrumbs first (most reliable when available)
          if (
            document._sys?.breadcrumbs &&
            Array.isArray(document._sys.breadcrumbs)
          ) {
            slug = document._sys.breadcrumbs.join('/').replace(/\.md$/, '');
          }
          // Fallback to filename
          else if (document._sys?.filename) {
            slug = document._sys.filename.replace(/\.md$/, '');
          }
          // Last resort: use relativePath
          else if (document._sys?.relativePath) {
            slug = document._sys.relativePath.replace(/\.md$/, '');
          }

          if (!slug) {
            console.warn(
              'TinaCMS: Could not determine slug for document',
              document,
            );
            return undefined;
          }

          if (collection.name === 'posts') {
            return `/posts/${slug}`;
          }

          if (collection.name === 'pages') {
            return `/${slug}`;
          }

          if (collection.name === 'projects') {
            return `/portafolio/${slug}`;
          }
        }
        return undefined;
      });
      cms.plugins.add(RouteMapping);
    });
    return cms;
  };
}

export default defineConfig(config);

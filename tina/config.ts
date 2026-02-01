import { defineConfig } from 'tinacms';
import { pagesFields, postsFields, projectFields } from './templates';

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main';

const config: any = {
  branch,
  // Use environment variables for TinaCMS credentials
  // Get these from tina.io and set in your .env file
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
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
      {
        format: 'md',
        label: 'Videos',
        name: 'videos',
        path: 'src/content/videos',
        match: {
          include: '**/*',
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'videoId',
            label: 'YouTube Video ID',
            required: true,
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date',
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'boolean',
            name: 'featured',
            label: 'Featured',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
};

export default defineConfig(config);

import type { TinaField } from 'tinacms';
export function pagesFields() {
  return [
    {
      type: 'string',
      name: 'title',
      label: 'Page Title',
      required: true,
    },
    {
      type: 'datetime',
      name: 'date',
      label: 'Publication Date',
      required: true,
    },
    {
      type: 'string',
      name: 'description',
      label: 'Short Description',
      ui: {
        component: 'textarea',
      },
    },
  ] as TinaField[];
}
export function postsFields() {
  return [
    {
      type: 'string',
      name: 'title',
      label: 'Article Title',
      required: true,
      isTitle: true,
    },
    {
      type: 'datetime',
      name: 'date',
      label: 'Publication Date',
      required: true,
    },
    {
      type: 'image',
      name: 'featuredImage',
      label: 'Featured Image',
    },
    {
      type: 'string',
      name: 'description',
      label: 'Short Description',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'string',
      name: 'tags',
      label: 'Tags',
      list: true,
    },
  ] as TinaField[];
}

export function projectFields() {
  return [
    {
      type: 'string',
      name: 'title',
      label: 'Project Title',
      required: true,
    },
    {
      type: 'datetime',
      name: 'date',
      label: 'Publication Date',
      required: true,
    },
    {
      type: 'string',
      name: 'description',
      label: 'Short Description',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'image',
      name: 'galleryImage',
      label: 'Project Images',
      list: true,
    },
    {
      type: 'string',
      name: 'techStack',
      label: 'Technologies',
      list: true,
    },
    {
      type: 'string',
      name: 'liveUrl',
      label: 'Live URL',
    },
    {
      type: 'string',
      name: 'repoUrl',
      label: 'Repository URL',
    },
  ] as TinaField[];
}

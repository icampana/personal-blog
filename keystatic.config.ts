import { collection, config, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: 'Iván Gabriel — Blog' } },
  collections: {
    posts: collection({
      label: 'Posts (ES)',
      slugField: 'title',
      path: 'src/content/posts/es/*',
      entryLayout: 'content',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Publication Date' }),
        description: fields.text({
          label: 'Short Description',
          multiline: true,
        }),
        path: fields.text({ label: 'Path' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Tag',
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/photos',
          publicPath: '/photos',
        }),
        body: fields.markdoc({
          label: 'Body',
          extension: 'md',
          options: {
            image: {
              directory: 'public/photos',
              publicPath: '/photos',
            },
          },
        }),
      },
    }),
    pages: collection({
      label: 'Pages (ES)',
      slugField: 'title',
      path: 'src/content/pages/es/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        path: fields.text({ label: 'Path' }),
        description: fields.text({
          label: 'Short Description',
          multiline: true,
        }),
        body: fields.markdoc({
          label: 'Body',
          extension: 'md',
          options: {
            image: { directory: 'public/photos', publicPath: '/photos' },
          },
        }),
      },
    }),
    projects: collection({
      label: 'Projects (ES)',
      slugField: 'title',
      path: 'src/content/projects/es/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        description: fields.text({ label: 'Description', multiline: true }),
        galleryImage: fields.array(
          fields.image({
            label: 'Image',
            directory: 'public/photos',
            publicPath: '/photos',
          }),
          {
            label: 'Gallery',
            itemLabel: (props) => props.value?.filename || 'Image',
          },
        ),
        techStack: fields.array(fields.text({ label: 'Tech' }), {
          label: 'Tech Stack',
          itemLabel: (props) => props.value || 'Tech',
        }),
        liveUrl: fields.url({ label: 'Live URL' }),
        repoUrl: fields.url({ label: 'Repo URL' }),
        body: fields.markdoc({
          label: 'Body',
          extension: 'md',
          options: {
            image: { directory: 'public/photos', publicPath: '/photos' },
          },
        }),
      },
    }),
    videos: collection({
      label: 'Videos (ES)',
      slugField: 'title',
      path: 'src/content/videos/es/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        videoId: fields.text({ label: 'YouTube Video ID' }),
        date: fields.date({ label: 'Date' }),
        description: fields.text({ label: 'Description', multiline: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        featured: fields.checkbox({ label: 'Featured' }),
        body: fields.markdoc({
          label: 'Body',
          extension: 'md',
          options: {
            image: { directory: 'public/photos', publicPath: '/photos' },
          },
        }),
      },
    }),
  },
});

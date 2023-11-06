import { defineConfig } from "tinacms";
import { postsFields, pagesFields } from "./templates";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: "da403933-32db-4dcf-b799-ebc141c1fd51", // Get this from tina.io
  token: "d34d778eb69b883ddc7b48c0757e4bfa7999ec25", // Get this from tina.io
  client: { skip: true },
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        format: "md",
        label: "Posts",
        name: "posts",
        path: "content/posts",
        match: {
          include: "**/*",
        },
        ui: {
          filename: {
            // if disabled, the editor can not edit the filename
            readonly: true,
            // Example of using a custom slugify function
            slugify: (values) => {
              console.debug(values);
              const articleDate = values?.date || new Date();

              // Values is an object containing all the values of the form. In this case it is {title?: string, topic?: string}
              return `${articleDate.getFullYear()}-${articleDate.getMonth() + 1}-${values?.title
                ?.toLowerCase()
                .replace(/ /g, '-')}`
            },
          },
        },
        fields: [
          {
            type: "rich-text",
            name: "body",
            label: "Body of Document",
            description: "This is the markdown body",
            isBody: true,
          },
          ...postsFields(),
        ],
      },
      {
        format: "md",
        label: "Pages",
        name: "pages",
        path: "content/pages",
        match: {
          include: "**/*",
        },
        fields: [
          {
            type: "rich-text",
            name: "body",
            label: "Body of Document",
            description: "This is the markdown body",
            isBody: true,
          },
          ...pagesFields(),
        ],
      },
    ],
  },
});

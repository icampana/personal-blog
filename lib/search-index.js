const path = require("path");
const fs = require("fs");
const Fuse = require('fuse.js');

async function generateSearchIndex() {
  const fuseOptions = { keys: ['title', 'description'], minMatchCharLength: 2, threshold: 0.3 };
  const allPosts = require(path.join(process.cwd(), ".contentlayer/generated/Post/_index.json"));

  const posts = allPosts.map((post) => ({
      title: post.title,
      date: post.date,
      description: post.description || post.summary,
      type: post.type,
      url: post.url,
    })
  );

  // Create the Fuse index
  const searchIndex = Fuse.createIndex(fuseOptions.keys, posts);

  // Serialize and save it
  const IndexPath = path.join(process.cwd(), "public", "search-index.json");
  fs.writeFileSync(IndexPath, JSON.stringify(searchIndex.toJSON(), null, 2));
  console.log("✅ Search index generated at:", IndexPath);

  const ListingPath = path.join(process.cwd(), "public", "search-posts.json");
  fs.writeFileSync(ListingPath, JSON.stringify(posts, null, 2));
  console.log("✅ Posts listing generated at:", ListingPath);
}

module.exports = { generateSearchIndex };
generateSearchIndex();

import frontmatter
import io
from os.path import basename, splitext, dirname, join
import glob
import json
import urllib.request

# Where are the files to modify
path = "content/posts/*/*.md"

# Loop through all files
for fname in glob.glob(path):
    with io.open(fname, 'r') as f:
        # Parse file's front matter
        frontmatter
        post = frontmatter.load(f)
        featuredImage = post.get('featuredImage')

        if featuredImage and (featuredImage.startswith('./') or (not featuredImage.startswith('/'))):
            post['featuredImage'] = '/photos/' + featuredImage.replace('./', '')
            print(post['featuredImage'])

            # Save the modified file
            newfile = io.open(fname, 'wb')
            frontmatter.dump(post, newfile)
            newfile.close()

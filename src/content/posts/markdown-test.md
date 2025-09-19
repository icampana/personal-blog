---
title: "Markdown Processing Test"
date: 2024-01-01
description: "Test post to verify all markdown processing features are working correctly"
tags:
  - Test
  - Markdown
---

# Markdown Processing Test

This is a test post to verify that all markdown processing features are working correctly in the Astro migration.

## Code Highlighting

Here's some JavaScript code:

```javascript
function greetUser(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to the blog, ${name}`;
}

const user = "Developer";
greetUser(user);
```

And some Python:

```python
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Generate first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {calculate_fibonacci(i)}")
```

## GitHub Flavored Markdown

- [x] Task completed
- [ ] Task pending
- [x] Another completed task

| Feature | Status | Notes |
|---------|--------|-------|
| Code highlighting | ✅ | Working |
| Tables | ✅ | Working |
| Checkboxes | ✅ | Working |

## Emoji Support

Here are some emojis: :rocket: :computer: :coffee: :thumbsup:

## Admonitions

:::note
This is a note admonition. It should appear with a blue theme.
:::

:::tip
This is a tip admonition. It should appear with a green theme.
:::

:::warning
This is a warning admonition. It should appear with a yellow theme.
:::

:::danger
This is a danger admonition. It should appear with a red theme.
:::

:::info
This is an info admonition. It should appear with a gray theme.
:::

## Line Breaks

This paragraph has a line break.
This should be on a new line due to remark-breaks.

## YouTube Video Embed

Here's a YouTube video that should be automatically embedded:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

## Headings with Slugs

All headings should automatically get slug IDs for linking.

### This Heading Should Have a Slug

You should be able to link to this heading using `#this-heading-should-have-a-slug`.

## Conclusion

If you can see all the features above working correctly, then the markdown processing pipeline has been successfully migrated to Astro!
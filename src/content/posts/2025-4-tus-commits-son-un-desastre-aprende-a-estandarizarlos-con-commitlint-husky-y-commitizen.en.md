---
title: >-
  Are Your Commits a Mess? Learn to Standardize Them with Commitlint, Husky,
  and Commitizen
date: 2025-03-31
featuredImage: /photos/2025/Commits-Computador.jpeg
description: >-
  Learn to standardize your commits with Commitlint, Husky, and Commitizen.
  Improve clarity and collaboration in your development projects.
tags:
  - Development
  - Clean Code
  - Programming
---

How many times have you reviewed a project's commit history only to find confusing, inconsistent, or simply useless messages? If you work in a team, you know this can quickly become a nightmare. The lack of a commit standard hinders understanding changes, collaboration, and project maintenance. But what if I told you there are tools that can solve this problem?

In this post, I'll show you how to use Commitlint, Husky, and Commitizen to standardize your commits and make your Git history much cleaner and more organized.

Why Standardize Commits?

Before we dive in, let's discuss why standardizing commits is crucial:

*   Clarity: Clear and concise commit messages facilitate understanding of the changes made.
*   Consistency: A standard ensures all commits follow the same format, improving history readability.
*   Collaboration: An organized commit history facilitates collaboration among team members.
*   Maintenance: A clear history simplifies error identification and future modifications.

Commitlint, Husky, and Commitizen: The Perfect Trio

These three tools work together to help you standardize your commits:

*   Commitlint: This tool verifies that commit messages comply with a predefined standard.
*   Husky: Husky allows you to execute Git scripts before making a commit, enabling you to verify messages with Commitlint.
*   Commitizen: This tool guides you in creating commit messages that adhere to the standard.

How to Use Them?

First, let's install the dependencies:

```shell
yarn add -D @commitlint/cli @commitlint/config-conventional commitizen husky
```

Create a base configuration for commitlint:

```shell
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

Create a base configuration for commitizen:

```shell
yarn commitizen init cz-conventional-changelog --yarn--dev--exact
```

Enable Husky hooks:

```shell
npx husky install
npx husky add .husky/commit-msg 'yarn commitlint --edit $1'
npx husky add .husky/prepare-commit-msg "exec < /dev/tty && npx cz --hook || true"
```

Finally, enable the scripts so that both Husky and Commitizen are triggered automatically. Within the `package.json`'s `scripts` section, add these two:

```json
{
  "scripts": {
    "prepare": "husky install",
    "commit": "git-cz"
  }
}
```

With this, automatically every time we attempt to make a commit, the tool for filling commit messages will be enabled, ensuring we follow a standard.

The rule is simple: all lowercase, a space between the colon and the description, and no trailing period. It's that straightforward.

Generally, I only write the first line, but here are the types we can use to keep everything organized:

*   chore: For updates that don't touch production code, such as changes to tools, configurations, and libraries.
*   feat: When adding a new feature or implementing something new in the code.
*   fix: To fix those annoying bugs that always appear.
*   refactor: You know those code changes that don't alter the final functionality? That's what this is for.
*   docs: When only touching documentation files.
*   perf: For changes that make the code faster and more efficient.
*   style: When changing code formatting, such as whitespace, semicolons, etc.
*   test: For adding or correcting tests in automated processes.
*   build: For changes to the build system or external dependencies.
*   ci: For changes to CI configuration files and scripts.
*   env: For modifications or additions to CI configuration files.

Examples of commits you'll appreciate:

*   chore: add commitlint and husky
*   chore(eslint): enforce double quotes in React
*   refactor: refactoring cache management to use Redis
*   feat: added AlovaJS for API calls
*   feat(page/dashboard): creating routing with React Router

With these standardized commits, it's much easier to understand what was done in the code. And if you work solo, can you imagine revisiting a project after 6 months? With organized commits, you'll recall everything much faster.

Conclusion:

Standardizing your commits might seem like a tedious task at first, but the long-term benefits are undeniable. With Commitlint, Husky, and Commitizen, you can create a clean, organized, and easy-to-understand Git history. Give them a try and see the difference!
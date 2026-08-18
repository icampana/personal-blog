#!/usr/bin/env node
/**
 * Round-trip gate: reads every Spanish post through Keystatic's reader and
 * reports which ones markdoc can fully parse.
 *
 * Pass 1 (strict): real keystatic.config.ts schema. Failures here are
 *   FRONTMATTER schema mismatches (legacy WordPress keys author, comments,
 *   path, wordpress_id, categories, post_format, _template are not in the
 *   posts collection schema). Not body failures.
 *
 * Pass 2 (body): tolerant schema covering every frontmatter key present in
 *   the corpus, then awaits entry.body() and walks the markdoc AST counting
 *   nodes with errors. Unknown constructs ({{< >}}, {% %}, :::note) do NOT
 *   throw in markdoc — they surface as entries in the AST node `errors`
 *   arrays. So the gate signal is AST errors, not thrown exceptions.
 *
 * Result: a list of posts markdoc cannot parse cleanly. Those become
 * frontmatter-only in the CMS (documented), never rewritten.
 */
import fs from 'fs/promises';
import path from 'path';
import { createReader } from '@keystatic/core/reader';
import { collection, config, fields } from '@keystatic/core';
import realConfig from '../keystatic.config.ts';

const TOLERANT_SCHEMA = {
  title: fields.text({ label: 'Title' }),
  date: fields.date({ label: 'Date' }),
  description: fields.text({ label: 'Description', multiline: true }),
  tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
  featuredImage: fields.text({ label: 'Featured Image' }),
  author: fields.text({ label: 'Author' }),
  categories: fields.array(fields.text({ label: 'Category' }), {
    label: 'Categories',
  }),
  comments: fields.checkbox({ label: 'Comments' }),
  path: fields.text({ label: 'Path' }),
  post_format: fields.array(fields.text({ label: 'Format' }), {
    label: 'Post Format',
  }),
  wordpress_id: fields.integer({ label: 'WordPress ID' }),
  _template: fields.text({ label: 'Template' }),
  body: fields.markdoc({ label: 'Body', extension: 'md' }),
};

const tolerantConfig = config({
  storage: { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Posts (ES)',
      slugField: 'title',
      path: 'src/content/posts/es/*',
      format: { contentField: 'body' },
      schema: TOLERANT_SCHEMA,
    }),
  },
});

function countAstErrors(node) {
  let count = (node.errors && node.errors.length) || 0;
  const messages = [];
  for (const err of node.errors || []) {
    if (err && err.message) messages.push(err.message);
  }
  for (const child of node.children || []) {
    const sub = countAstErrors(child);
    count += sub.count;
    messages.push(...sub.messages);
  }
  return { count, messages };
}

const strict = { ok: [], failed: [] };
{
  const reader = createReader(process.cwd(), realConfig);
  for (const slug of await reader.collections.posts.list()) {
    try {
      await reader.collections.posts.read(slug);
      strict.ok.push(slug);
    } catch (err) {
      strict.failed.push({ slug, error: err.message });
    }
  }
}

const body = { ok: [], failed: [] };
{
  const reader = createReader(process.cwd(), tolerantConfig);
  for (const slug of await reader.collections.posts.list()) {
    try {
      const entry = await reader.collections.posts.read(slug);
      const parsed = await entry.body();
      const { count, messages } = countAstErrors(parsed.node);
      if (count > 0) {
        body.failed.push({
          slug,
          errorCount: count,
          messages: [...new Set(messages)].slice(0, 5),
        });
      } else {
        body.ok.push(slug);
      }
    } catch (err) {
      body.failed.push({ slug, errorCount: -1, error: err.message });
    }
  }
}

const report = {
  strict,
  body,
  notes: {
    strictFailuresAreFrontmatter: true,
    bodyFailuresAreMarkdocAstErrors: true,
    markdocErrorsDoNotThrow: true,
  },
};

await fs.writeFile(
  path.join(process.cwd(), 'keystatic-roundtrip-report.json'),
  JSON.stringify(report, null, 2),
);

console.log(`STRICT  OK: ${strict.ok.length} | FAILED: ${strict.failed.length} (frontmatter)`);
console.log(`BODY    OK: ${body.ok.length} | FAILED: ${body.failed.length} (markdoc AST errors)`);
for (const f of body.failed) {
  console.log(`  ${f.slug} [${f.errorCount} errors]`);
  for (const m of f.messages || []) console.log(`    - ${m}`);
}

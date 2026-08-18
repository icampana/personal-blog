#!/usr/bin/env node
/**
 * Surgically strips legacy WordPress frontmatter keys from blog content so
 * every post/pages opens in the Keystatic editor (Keystatic's parseProps
 * throws on unknown keys).
 *
 * The strip is LINE-BASED, NOT a YAML re-serialization: a gray-matter
 * round-trip would rewrite dates as ISO strings and reformat quotes across
 * ~500 files — unacceptable diff noise. Only the targeted key lines and
 * their continuation lines are removed; every other byte is preserved.
 *
 *   wordpress_id, author, comments, categories, post_format, _template,
 *   layout  -> removed from posts
 *   wordpress_id, author, comments -> removed from pages
 *   path is KEPT (it is the URL override — removing it changes URLs).
 *   projects and videos are never touched.
 *
 * Usage:
 *   node scripts/strip-legacy-frontmatter.mjs          # dry-run
 *   node scripts/strip-legacy-frontmatter.mjs --apply  # write files
 */
import fs from 'fs';
import path from 'path';
import { isDeepStrictEqual } from 'util';
import matter from 'gray-matter';

export const STRIP_KEYS = {
  posts: [
    'wordpress_id',
    'author',
    'comments',
    'categories',
    'post_format',
    '_template',
    'layout',
  ],
  pages: ['wordpress_id', 'author', 'comments'],
  projects: [],
  videos: [],
};

const KEY_LINE = /^([A-Za-z_][A-Za-z0-9_-]*):/;
const INDENTED = /^\s/;
const COLUMN_ZERO_LIST_ITEM = /^-\s/;

/**
 * Split text into frontmatter lines (between the first `---` and its closing
 * `---`, delimiters excluded) and the rest. Returns null when the text has
 * no frontmatter block.
 */
export function splitFrontmatter(text) {
  const lines = text.split('\n');
  if (lines.length === 0 || lines[0].trim() !== '---') return null;
  let close = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      close = i;
      break;
    }
  }
  if (close === -1) return null;
  return { fm: lines.slice(1, close), rest: lines.slice(close + 1) };
}

function isContinuation(line) {
  if (line.trim() === '') return false; // blank lines separate keys: keep them
  if (INDENTED.test(line)) return true;
  if (COLUMN_ZERO_LIST_ITEM.test(line) || line.trim() === '-') return true;
  return false;
}

/**
 * Remove legacy frontmatter keys (plus their continuation lines) from `text`.
 * Returns { output, removed } where `removed` maps key -> number of lines.
 */
export function stripLegacyFrontmatter(text, collection) {
  const keysToRemove = new Set(STRIP_KEYS[collection] || []);
  const parts = splitFrontmatter(text);
  if (!parts) return { output: text, removed: {} };

  const removed = {};
  const out = [];
  const fm = parts.fm;
  for (let i = 0; i < fm.length; i++) {
    const line = fm[i];
    const m = line.match(KEY_LINE);
    if (m && keysToRemove.has(m[1])) {
      removed[m[1]] = (removed[m[1]] || 0) + 1;
      let j = i + 1;
      while (j < fm.length && isContinuation(fm[j])) {
        removed[m[1]] += 1;
        j++;
      }
      i = j - 1;
      continue;
    }
    out.push(line);
  }

  const output = ['---', ...out, '---', ...parts.rest].join('\n');
  return { output, removed };
}

/**
 * Verify a candidate stripped output against the original `text` for
 * `collection`: re-parse both with gray-matter and assert (a) no removed key
 * survives, (b) every remaining frontmatter value is unchanged, (c) the body
 * is identical.
 */
export function verifyStrip(text, candidateOutput, collection) {
  const before = matter(text);
  const after = matter(candidateOutput);
  const errors = [];

  for (const key of STRIP_KEYS[collection] || []) {
    if (key in after.data) {
      errors.push(`key "${key}" is still present after the strip`);
    }
  }
  for (const key of Object.keys(before.data)) {
    if ((STRIP_KEYS[collection] || []).includes(key)) continue;
    if (!(key in after.data)) {
      errors.push(`key "${key}" disappeared from frontmatter`);
    } else if (!isDeepStrictEqual(before.data[key], after.data[key])) {
      errors.push(`value of "${key}" changed`);
    }
  }
  if (after.content !== before.content) {
    errors.push('markdown body changed');
  }

  return { ok: errors.length === 0, errors };
}

function collectMdFiles(dir) {
  const out = [];
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) out.push(full);
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return out;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const dry = !apply;
  const CONTENT_DIRS = [
    { type: 'posts', dir: path.join(process.cwd(), 'src', 'content', 'posts') },
    { type: 'pages', dir: path.join(process.cwd(), 'src', 'content', 'pages') },
  ];

  const stats = { filesTouched: 0, linesRemoved: 0, byKey: {}, byFile: {} };
  const pending = [];

  for (const { type, dir } of CONTENT_DIRS) {
    for (const file of collectMdFiles(dir)) {
      const text = fs.readFileSync(file, 'utf8');
      const before = matter(text);
      const hasLegacy = (STRIP_KEYS[type] || []).some((k) => k in before.data);
      if (!hasLegacy) continue;

      const { output, removed } = stripLegacyFrontmatter(text, type);
      const { ok, errors } = verifyStrip(text, output, type);
      if (!ok) {
        console.error(`✗ VERIFY FAILED: ${file}`);
        for (const e of errors) console.error(`    - ${e}`);
        process.exitCode = 1;
        continue;
      }

      const totalRemoved = Object.values(removed).reduce((a, b) => a + b, 0);
      stats.filesTouched += 1;
      stats.linesRemoved += totalRemoved;
      for (const [key, count] of Object.entries(removed)) {
        stats.byKey[key] = (stats.byKey[key] || 0) + count;
      }
      stats.byFile[path.relative(process.cwd(), file)] = removed;
      pending.push({ file, output });
    }
  }

  for (const { file, output } of pending) {
    const rel = path.relative(process.cwd(), file);
    const keys = Object.entries(stats.byFile[rel])
      .map(([k, n]) => `${k}(${n} line${n > 1 ? 's' : ''})`)
      .join(', ');
    console.log(`${dry ? '[dry]' : '[write]'} ${rel}: ${keys}`);
  }

  console.log(
    `\n${stats.filesTouched} files ${dry ? 'would be touched' : 'touched'} ` +
      `(${stats.linesRemoved} lines removed). ${apply ? 'apply' : 'dry-run'}.`,
  );
  console.log('Removed per key:', JSON.stringify(stats.byKey));

  if (apply && process.exitCode !== 1) {
    for (const { file, output } of pending) {
      fs.writeFileSync(file, output);
    }
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}

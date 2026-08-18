#!/usr/bin/env node
/**
 * Migrates content from the flat/suffixed layout to per-locale directories.
 * Dry-run by default; pass --apply to write.
 *
 *   foo.md         -> es/foo.md
 *   foo.en.md      -> en/foo.md
 *   slug/index.md  -> es/slug.md
 *   slug/index.en.md -> en/slug.md
 */
import fs from 'fs';
import path from 'path';

const CONTENT_TYPES = ['posts', 'pages', 'projects', 'videos'];
const LOCALE_SUFFIXES = ['en', 'pt', 'fr'];
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');

/**
 * Map a path relative to a content-type dir (e.g. "foo.en.md") to the new
 * relative path under the locale layout. Returns null for non-content files.
 */
export function resolveTarget(relPath) {
  const dir = path.posix.dirname(relPath);
  const base = path.posix.basename(relPath);

  const isIndexFile = /^index(\.(en|pt|fr))?\.md$/.test(base);
  if (dir !== '.' && !isIndexFile) return null; // only flat or folder/index files

  let locale = 'es';
  let name = base;

  for (const suffix of LOCALE_SUFFIXES) {
    if (base === `index.${suffix}.md`) {
      locale = suffix;
      name = path.posix.basename(dir) + '.md';
      return `${locale}/${name}`;
    }
    if (base.endsWith(`.${suffix}.md`)) {
      locale = suffix;
      name = base.replace(`.${suffix}.md`, '.md');
      return `${locale}/${name}`;
    }
  }

  if (base === 'index.md') {
    name = path.posix.basename(dir) + '.md';
  } else if (!base.endsWith('.md')) {
    return null;
  }

  return `${locale}/${name}`;
}

function collectFiles(contentDir) {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else out.push(path.relative(contentDir, full));
    }
  };
  walk(contentDir);
  return out;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const dry = !apply;
  const all = [];
  const collisions = new Set();

  for (const type of CONTENT_TYPES) {
    const contentDir = path.join(ROOT, 'src', 'content', type);
    if (!fs.existsSync(contentDir)) continue;
    const files = collectFiles(contentDir);
    for (const rel of files) {
      const target = resolveTarget(rel);
      if (!target) continue;
      const key = `${type}/${target}`;
      if (collisions.has(key)) {
        console.error(`✗ COLLISION: ${type}/${rel} -> ${target}`);
        process.exitCode = 1;
      }
      collisions.add(key);
      all.push({ type, from: rel, to: target });
    }
  }

  for (const { type, from, to } of all) {
    const fromFull = path.join(ROOT, 'src', 'content', type, from);
    const toFull = path.join(ROOT, 'src', 'content', type, to);
    console.log(`${dry ? '[dry]' : '[move]'} ${type}/${from} -> ${type}/${to}`);
    if (!dry) {
      fs.mkdirSync(path.dirname(toFull), { recursive: true });
      fs.renameSync(fromFull, toFull);
    }
  }

  console.log(`\n${all.length} files ${dry ? 'would be moved' : 'moved'} (${apply ? 'apply' : 'dry-run'}).`);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}

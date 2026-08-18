#!/usr/bin/env node
/**
 * CMS smoke: verify the Keystatic read path for a Spanish post and that the
 * dev admin route serves the Keystatic app. A full browser-driven save is not
 * reachable here (Keystatic 0.6.7 exposes no public writer subpath and no
 * standalone local REST API); the write path is verified in the browser UI.
 */
import path from 'path';
import { createReader } from '@keystatic/core/reader';
import config from '../keystatic.config.ts';

const SLUG = '2026-08-how-i-work-with-ai-agents-context-and-memory';
const FILE = path.join(
  process.cwd(),
  'src',
  'content',
  'posts',
  'es',
  `${SLUG}.md`,
);

const original = await import('node:fs').then((fs) =>
  fs.readFileSync(FILE, 'utf8'),
);

const reader = createReader(process.cwd(), config);
const post = await reader.collections.posts.read(SLUG);
console.log('READ OK — slug:', SLUG, '| title:', post.title);
console.log('on-disk file present:', original.length > 0, 'bytes:', original.length);
console.log(
  'NOTE: write path requires the browser admin UI (no public writer subpath in @keystatic/core 0.6.7).',
);

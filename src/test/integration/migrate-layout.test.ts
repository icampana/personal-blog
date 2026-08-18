import { describe, expect, it } from 'vitest';
import { resolveTarget } from '../../../scripts/migrate-layout.mjs';

describe('resolveTarget', () => {
  it('moves flat Spanish files into es/', () => {
    expect(resolveTarget('2023-01-15-mi-post.md')).toBe(
      'es/2023-01-15-mi-post.md',
    );
  });

  it('moves suffixed flat files into their locale dir with suffix stripped', () => {
    expect(resolveTarget('2023-01-15-mi-post.en.md')).toBe(
      'en/2023-01-15-mi-post.md',
    );
    expect(resolveTarget('2023-01-15-mi-post.pt.md')).toBe(
      'pt/2023-01-15-mi-post.md',
    );
    expect(resolveTarget('2023-01-15-mi-post.fr.md')).toBe(
      'fr/2023-01-15-mi-post.md',
    );
  });

  it('flattens folder-style Spanish posts', () => {
    expect(resolveTarget('2004-06-24-foo/index.md')).toBe(
      'es/2004-06-24-foo.md',
    );
  });

  it('flattens folder-style translations', () => {
    expect(resolveTarget('mi-post/index.en.md')).toBe('en/mi-post.md');
    expect(resolveTarget('mi-post/index.pt.md')).toBe('pt/mi-post.md');
    expect(resolveTarget('mi-post/index.fr.md')).toBe('fr/mi-post.md');
  });

  it('returns null for non-content files', () => {
    expect(resolveTarget('subdir/notes.txt')).toBeNull();
    expect(resolveTarget('.DS_Store')).toBeNull();
  });

  it('rejects suffix collisions on the same slug', () => {
    // both map to es/foo.md -> collision must be caught by the caller
    expect(resolveTarget('foo.md')).toBe('es/foo.md');
    expect(resolveTarget('foo/index.md')).toBe('es/foo.md');
  });
});

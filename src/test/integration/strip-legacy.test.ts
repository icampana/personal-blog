import { describe, expect, it } from 'vitest';
import {
  STRIP_KEYS,
  stripLegacyFrontmatter,
  verifyStrip,
} from '../../../scripts/strip-legacy-frontmatter.mjs';

describe('STRIP_KEYS', () => {
  it('defines the posts key set', () => {
    expect(STRIP_KEYS.posts).toEqual([
      'wordpress_id',
      'author',
      'comments',
      'categories',
      'post_format',
      '_template',
      'layout',
    ]);
  });

  it('defines the pages key set (no categories/template/layout)', () => {
    expect(STRIP_KEYS.pages).toEqual(['wordpress_id', 'author', 'comments']);
  });

  it('leaves projects and videos untouched', () => {
    expect(STRIP_KEYS.projects).toEqual([]);
    expect(STRIP_KEYS.videos).toEqual([]);
  });
});

describe('stripLegacyFrontmatter (posts)', () => {
  it('removes a single-line key', () => {
    const input = `---
author: ivan
date: 2004-06-24 05:21:00
---

Body line.
`;
    const { output, removed } = stripLegacyFrontmatter(input, 'posts');
    expect(output).toBe(`---
date: 2004-06-24 05:21:00
---

Body line.
`);
    expect(removed).toEqual({ author: 1 });
  });

  it('removes a key with column-0 list items', () => {
    const input = `---
categories:
- A
- B
date: 2004-06-24 05:21:00
---
`;
    const { output } = stripLegacyFrontmatter(input, 'posts');
    expect(output).toBe(`---
date: 2004-06-24 05:21:00
---
`);
  });

  it('removes a key with indented list items (post_format shape)', () => {
    const input = `---
post_format:
  - Minientrada
title: Hola
---
`;
    const { output } = stripLegacyFrontmatter(input, 'posts');
    expect(output).toBe(`---
title: Hola
---
`);
  });

  it('removes a folded scalar with indented continuation lines', () => {
    const input = `---
_template: >-
  line one
  line two
title: Título
---
`;
    const { output } = stripLegacyFrontmatter(input, 'posts');
    expect(output).toBe(`---
title: Título
---
`);
  });

  it('removes multiple adjacent keys but preserves a separating blank line', () => {
    const input = `---
wordpress_id: 1060
author: ivan

date: 2004-06-24 05:21:00
---
`;
    const { output, removed } = stripLegacyFrontmatter(input, 'posts');
    expect(output).toBe(`---

date: 2004-06-24 05:21:00
---
`);
    expect(removed).toEqual({ wordpress_id: 1, author: 1 });
  });

  it('preserves every other frontmatter line byte-for-byte', () => {
    const input = `---
wordpress_id: 1060
title: 'Título con: dos puntos'
date: 2004-06-24 05:21:00
featuredImage: /photos/portada.jpg
path: /2004/06/13-gracias
tags:
- Música
- Vida
description: "Una descripción: con comillas"
---

Cuerpo.
`;
    const { output } = stripLegacyFrontmatter(input, 'posts');
    expect(output).toBe(`---
title: 'Título con: dos puntos'
date: 2004-06-24 05:21:00
featuredImage: /photos/portada.jpg
path: /2004/06/13-gracias
tags:
- Música
- Vida
description: "Una descripción: con comillas"
---

Cuerpo.
`);
  });

  it('does not touch body lines that start with a key name', () => {
    const input = `---
author: ivan
---

wordpress_id: 999
author: not-frontmatter
Categories: también el cuerpo
`;
    const { output } = stripLegacyFrontmatter(input, 'posts');
    expect(output).toBe(`---
---

wordpress_id: 999
author: not-frontmatter
Categories: también el cuerpo
`);
  });

  it('leaves files without frontmatter untouched', () => {
    const input = `no frontmatter at all
wordpress_id: 123
`;
    const { output } = stripLegacyFrontmatter(input, 'posts');
    expect(output).toBe(input);
  });
});

describe('stripLegacyFrontmatter (pages)', () => {
  it('removes wordpress_id, author and comments but keeps path', () => {
    const input = `---
wordpress_id: 1061
path: /sobre-el-autor
author: ivan
comments: false
title: Sobre Mí
---
`;
    const { output } = stripLegacyFrontmatter(input, 'pages');
    expect(output).toBe(`---
path: /sobre-el-autor
title: Sobre Mí
---
`);
  });

  it('does not remove categories/_template/post_format from pages', () => {
    const input = `---
categories:
- A
_template: page
title: Hola
---
`;
    const { output } = stripLegacyFrontmatter(input, 'pages');
    expect(output).toBe(input);
  });
});

describe('stripLegacyFrontmatter (projects/videos untouched)', () => {
  it('returns projects text unchanged even with legacy keys', () => {
    const input = `---
wordpress_id: 7
title: Proyecto
---
`;
    const { output } = stripLegacyFrontmatter(input, 'projects');
    expect(output).toBe(input);
  });

  it('returns videos text unchanged even with legacy keys', () => {
    const input = `---
wordpress_id: 9
title: Video
---
`;
    const { output } = stripLegacyFrontmatter(input, 'videos');
    expect(output).toBe(input);
  });
});

describe('verifyStrip', () => {
  it('reports ok when every removed key is gone and the rest is intact', () => {
    const input = `---
wordpress_id: 1060
categories:
- A
- B
date: 2004-06-24 05:21:00
path: /2004/06/x
tags:
- Uno
---

Cuerpo intacto.
`;
    const { output } = stripLegacyFrontmatter(input, 'posts');
    const result = verifyStrip(input, output, 'posts');
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('fails when a removed key survives in the candidate output', () => {
    const input = `---
date: 2004-06-24 05:21:00
author: ivan
---
`;
    const result = verifyStrip(input, input, 'posts');
    expect(result.ok).toBe(false);
    expect(result.errors.join('')).toContain('author');
  });

  it('fails when a remaining key value is altered', () => {
    const input = `---
date: 2004-06-24 05:21:00
title: Original
author: ivan
---
`;
    const tampered = `---
date: 2004-06-24 05:21:00
title: Cambiada
---
`;
    const result = verifyStrip(input, tampered, 'posts');
    expect(result.ok).toBe(false);
    expect(result.errors.join('')).toContain('title');
  });

  it('fails when the markdown body is altered', () => {
    const input = `---
author: ivan
title: Original
---

Cuerpo uno.
`;
    const tampered = `---
title: Original
---

Cuerpo DOS.
`;
    const result = verifyStrip(input, tampered, 'posts');
    expect(result.ok).toBe(false);
    expect(result.errors.join('')).toContain('body');
  });
});

import { Document } from 'flexsearch';
import { beforeEach, describe, expect, it } from 'vitest';

// Mock search data that matches the actual structure
const mockSearchData = [
  {
    id: 0,
    title:
      'Domina React: Patrones de Diseño y Trucos para Desarrolladores Junior',
    url: '/posts/react-patterns',
    content:
      'Si eres programador y has ido ganando experiencia, en algún momento de tu carrera encontrarás el término "patrones de diseño de software". React es una biblioteca muy popular para el desarrollo frontend.',
    summary:
      'Descubre los Patrones de Diseño y Mejores Prácticas de React en este tutorial para desarrolladores junior. Aprende cómo construir aplicaciones más eficientes.',
    tags: ['React', 'Development', 'Frontend'],
    date: '2023-10-23T00:00:00.000Z',
    type: 'post',
  },
  {
    id: 1,
    title: 'Usando ChatGPT como tu Mentor para mejorar como programador',
    url: '/posts/chatgpt-mentor',
    content:
      'Siendo desarrollador, lo que más tenemos es preguntas, especialmente si aún eres junior. ChatGPT puede ser tu mentor virtual.',
    summary:
      'Impulsa tus habilidades como programador con ChatGPT, un tutor virtual para desarrolladores junior.',
    tags: ['Development', 'AI', 'Mentoring'],
    date: '2023-11-13T00:00:00.000Z',
    type: 'post',
  },
  {
    id: 2,
    title: 'Tech Wars: ¿Qué tecnología debo escoger para mi carrera?',
    url: '/posts/tech-wars',
    content:
      'Estás metido en el mundo de la tecnología y quieres saber cuáles son los mejores stacks tecnológicos para lograr ese trabajo soñado en TI.',
    summary:
      'Exploración de Tendencias Tecnológicas: Un Análisis entre Empresas Consolidadas y Startups.',
    tags: ['Development', 'Tech Stacks', 'Remote Work'],
    date: '2023-11-22T00:00:00.000Z',
    type: 'post',
  },
];

describe('Search Functionality', () => {
  let index: Document;
  let searchData: any[];

  beforeEach(() => {
    searchData = mockSearchData;

    index = new Document({
      document: {
        id: 'id',
        index: ['title', 'summary', 'content'],
        store: ['title', 'url', 'type', 'date', 'summary', 'tags'],
      },
      tokenize: 'forward',
      resolution: 9,
      threshold: 1,
      depth: 3,
    });

    // Add documents to index
    searchData.forEach((item) => index.add(item));
  });

  describe('Search Data', () => {
    it('should load search data successfully', () => {
      expect(searchData).toBeDefined();
      expect(Array.isArray(searchData)).toBe(true);
      expect(searchData.length).toBeGreaterThan(0);
    });

    it('should have required fields in search data', () => {
      const firstItem = searchData[0];
      expect(firstItem).toHaveProperty('title');
      expect(firstItem).toHaveProperty('content');
      expect(firstItem).toHaveProperty('summary');
      expect(firstItem).toHaveProperty('url');
    });
  });

  describe('Search Queries', () => {
    it('should find posts by content', () => {
      const results = index.search('desarrollo', { enrich: true });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find posts by title', () => {
      const results = index.search('React', { enrich: true });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find posts by summary', () => {
      const results = index.search('programador', { enrich: true });
      expect(results.length).toBeGreaterThan(0);
    });
  });
});

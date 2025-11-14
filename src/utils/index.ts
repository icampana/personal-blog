import type { CollectionEntry } from 'astro:content';
import readingTime from 'reading-time';
import striptags from 'striptags';

export function getReadingTime(content: string) {
  if (!content) {
    return {
      minutes: 0,
      text: '0 min read',
      time: 0,
      words: 0,
    };
  }
  return readingTime(content);
}

export function getSummary(htmlContent: string, length: number = 200): string {
  return striptags(htmlContent).slice(0, length);
}

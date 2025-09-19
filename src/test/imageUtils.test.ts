import { describe, expect, it } from 'vitest';
import {
  DEFAULT_IMAGE_SIZES,
  generateSizes,
  generateSrcSet,
  getImageMetadata,
  getOptimalFormat,
  normalizeImagePath,
} from '../utils/imageUtils';

describe('Image Utilities', () => {
  describe('normalizeImagePath', () => {
    it('should return placeholder for empty path', () => {
      expect(normalizeImagePath('')).toBe('/images/placeholder.svg');
      expect(normalizeImagePath(undefined)).toBe('/images/placeholder.svg');
    });

    it('should handle external URLs', () => {
      const httpUrl = 'http://example.com/image.jpg';
      const httpsUrl = 'https://example.com/image.jpg';
      const protocolRelative = '//example.com/image.jpg';

      expect(normalizeImagePath(httpUrl)).toBe(httpUrl);
      expect(normalizeImagePath(httpsUrl)).toBe(httpsUrl);
      expect(normalizeImagePath(protocolRelative)).toBe(protocolRelative);
    });

    it('should handle relative paths from content', () => {
      expect(normalizeImagePath('./photos/image.jpg')).toBe(
        '/photos/image.jpg',
      );
      expect(normalizeImagePath('./image.jpg')).toBe('/photos/image.jpg');
    });

    it('should ensure path starts with /', () => {
      expect(normalizeImagePath('image.jpg')).toBe('/photos/image.jpg');
      expect(normalizeImagePath('/images/image.jpg')).toBe('/images/image.jpg');
    });
  });

  describe('generateSizes', () => {
    it('should generate sizes string from breakpoints', () => {
      const breakpoints = {
        '(max-width: 768px)': '100vw',
        '(max-width: 1200px)': '50vw',
        '': '33vw',
      };

      const sizes = generateSizes(breakpoints);
      expect(sizes).toContain('(max-width: 768px) 100vw');
      expect(sizes).toContain('(max-width: 1200px) 50vw');
      expect(sizes).toContain(' 33vw');
    });
  });

  describe('getOptimalFormat', () => {
    it('should return webp as default', () => {
      expect(getOptimalFormat()).toBe('webp');
    });

    it('should detect AVIF support in newer Chrome', () => {
      const chromeUA =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
      expect(getOptimalFormat(chromeUA)).toBe('avif');
    });

    it('should detect WebP support in supported browsers', () => {
      const firefoxUA =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0';
      expect(getOptimalFormat(firefoxUA)).toBe('webp');
    });

    it('should fallback to jpg for unsupported browsers', () => {
      const oldIE = 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)';
      expect(getOptimalFormat(oldIE)).toBe('jpg');
    });
  });

  describe('generateSrcSet', () => {
    it('should generate srcset string', () => {
      const basePath = '/images/test.jpg';
      const sizes = [
        { width: 400, height: 300 },
        { width: 800, height: 600 },
      ];

      const srcSet = generateSrcSet(basePath, sizes);
      expect(srcSet).toBe(
        '/images/test.jpg?w=400 400w, /images/test.jpg?w=800 800w',
      );
    });
  });

  describe('getImageMetadata', () => {
    it('should extract metadata from image path', () => {
      const metadata = getImageMetadata('/images/test.jpg');
      expect(metadata.path).toBe('/images/test.jpg');
      expect(metadata.filename).toBe('test.jpg');
      expect(metadata.extension).toBe('jpg');
      expect(metadata.isExternal).toBe(false);
      expect(metadata.isOptimizable).toBe(true);
    });

    it('should detect external images', () => {
      const metadata = getImageMetadata('https://example.com/image.png');
      expect(metadata.isExternal).toBe(true);
      expect(metadata.isOptimizable).toBe(true);
    });

    it('should detect non-optimizable formats', () => {
      const metadata = getImageMetadata('/images/icon.svg');
      expect(metadata.extension).toBe('svg');
      expect(metadata.isOptimizable).toBe(false);
    });

    it('should handle relative paths', () => {
      const metadata = getImageMetadata('./photos/image.png');
      expect(metadata.path).toBe('/photos/image.png');
      expect(metadata.filename).toBe('image.png');
    });
  });

  describe('DEFAULT_IMAGE_SIZES', () => {
    it('should have predefined sizes', () => {
      expect(DEFAULT_IMAGE_SIZES).toHaveLength(4);
      expect(DEFAULT_IMAGE_SIZES[0]).toEqual({ width: 400, height: 300 });
      expect(DEFAULT_IMAGE_SIZES[3]).toEqual({ width: 1600, height: 1200 });
    });
  });
});

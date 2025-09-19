/**
 * Image utility functions for handling image paths and optimization
 */

export interface ImageSizes {
  width: number;
  height: number;
}

export const DEFAULT_IMAGE_SIZES: ImageSizes[] = [
  { width: 400, height: 300 },
  { width: 800, height: 600 },
  { width: 1200, height: 900 },
  { width: 1600, height: 1200 },
];

/**
 * Normalize image path for consistent handling
 */
export function normalizeImagePath(imagePath?: string): string {
  if (!imagePath) return '/images/placeholder.svg';

  // Handle external URLs
  if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
    return imagePath;
  }

  // Handle relative paths from content
  if (imagePath.startsWith('./photos/')) {
    return imagePath.replace('./photos/', '/photos/');
  }

  if (imagePath.startsWith('./')) {
    return imagePath.replace('./', '/photos/');
  }

  // Ensure path starts with /
  if (!imagePath.startsWith('/')) {
    return `/photos/${imagePath}`;
  }

  return imagePath;
}

/**
 * Generate responsive image sizes string
 */
export function generateSizes(breakpoints: { [key: string]: string }): string {
  return Object.entries(breakpoints)
    .map(([media, size]) => `${media} ${size}`)
    .join(', ');
}

/**
 * Get optimized image format based on browser support
 */
export function getOptimalFormat(userAgent?: string): 'webp' | 'avif' | 'jpg' {
  if (!userAgent) return 'webp';

  // Check for AVIF support (newer browsers)
  if (
    userAgent.includes('Chrome/') &&
    parseInt(userAgent.split('Chrome/')[1]) >= 85
  ) {
    return 'avif';
  }

  // Check for WebP support
  if (
    userAgent.includes('Chrome/') ||
    userAgent.includes('Firefox/') ||
    userAgent.includes('Safari/')
  ) {
    return 'webp';
  }

  return 'jpg';
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(basePath: string, sizes: ImageSizes[]): string {
  return sizes
    .map(({ width }) => `${basePath}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Extract image metadata from path
 */
export function getImageMetadata(imagePath: string) {
  const normalizedPath = normalizeImagePath(imagePath);
  const filename = normalizedPath.split('/').pop() || '';
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  return {
    path: normalizedPath,
    filename,
    extension,
    isExternal:
      normalizedPath.startsWith('http') || normalizedPath.startsWith('//'),
    isOptimizable: ['jpg', 'jpeg', 'png', 'webp'].includes(extension),
  };
}

export function generateImgxUrl(
  originalSrc: string,
  width: number,
  height?: number,
  quality: number = 80,
  format: string = 'auto',
): string {
  const IMGX_DOMAIN = import.meta.env.PUBLIC_IMGX_DOMAIN;

  let imagePath = originalSrc;

  // If it's a relative path, remove the leading slash if present, as Imgix expects paths relative to the source root
  if (imagePath.startsWith('/')) {
    imagePath = imagePath.substring(1);
  }

  // Build imgx parameters
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  if (format !== 'auto') params.set('f', format);
  params.set('fit', 'cover');

  // Construct the URL directly
  return `${IMGX_DOMAIN}/${imagePath}?${params.toString()}`;
}

export function generateImgxSrcSet(
  originalSrc: string,
  width: number,
  height?: number,
  quality: number = 80,
  format: string = 'auto',
): string {
  return [
    `${generateImgxUrl(originalSrc, Math.round(width * 0.5), height ? Math.round(height * 0.5) : undefined, quality, format)} ${Math.round(width * 0.5)}w`,
    `${generateImgxUrl(originalSrc, width, height, quality, format)} ${width}w`,
    `${generateImgxUrl(originalSrc, Math.round(width * 1.5), height ? Math.round(height * 1.5) : undefined, quality, format)} ${Math.round(width * 1.5)}w`,
    `${generateImgxUrl(originalSrc, Math.round(width * 2), height ? Math.round(height * 2) : undefined, quality, format)} ${Math.round(width * 2)}w`,
  ].join(', ');
}

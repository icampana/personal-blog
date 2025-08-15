
/**
 * Cleans a tag string by removing accents and converting spaces to hyphens for slug usage.
 * @param tag The tag string to clean
 * @returns The cleaned slug string
 */
export function cleanTag(tag: string): string {
  return tag
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

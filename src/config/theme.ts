/**
 * Site-wide theme configuration
 * Centralized theme names to avoid hardcoding across components
 */

export const themeConfig = {
  /** Light theme name (default) */
  light: 'autumn',
  /** Dark theme name */
  dark: 'night',
} as const;

export type ThemeName = (typeof themeConfig)[keyof typeof themeConfig];

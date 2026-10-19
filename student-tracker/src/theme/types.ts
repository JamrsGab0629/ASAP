export type ColorScheme = 'light' | 'dark';
export type ThemePreference = 'system' | ColorScheme;

export type Palette = {
  bg: string;
  surface: string;
  tint: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  onPrimary: string;
  hero: string; // big filled cards
  onHero: string;
  onHeroMuted: string;
  success: string;
  warning: string;
  danger: string;
};
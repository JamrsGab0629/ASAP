import type { ColorScheme, Palette } from './types';

const light: Palette = {
  bg: '#F6F8F6',
  surface: '#FFFFFF',
  tint: '#E9F0EB',
  text: '#111A16',
  textMuted: '#5E6B64',
  border: '#DDE4DF',
  primary: '#14532D',
  onPrimary: '#FFFFFF',
  hero: '#14532D',
  onHero: '#FFFFFF',
  onHeroMuted: '#CFE3D6',
  success: '#2E6B45',
  warning: '#8A5A0F',
  danger: '#8F2D26',
};

const dark: Palette = {
  bg: '#0C1411',
  surface: '#141F1A',
  tint: '#1B2D24',
  text: '#EAF1ED',
  textMuted: '#8FA096',
  border: '#24332B',
  primary: '#4FAE7B',
  onPrimary: '#0C1411',
  hero: '#1A6B3A',
  onHero: '#FFFFFF',
  onHeroMuted: '#CFE3D6',
  success: '#58B77F',
  warning: '#D9A441',
  danger: '#E0675E',
};

// To add another theme later, add a palette here and extend ColorScheme.
export const PALETTES: Record<ColorScheme, Palette> = { light, dark };
import { createContext, useContext } from 'react';
import type { ColorScheme, Palette, ThemePreference } from './types';

export type ThemeValue = {
  colors: Palette;
  scheme: ColorScheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeValue | null>(null);

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>');
  return value;
}
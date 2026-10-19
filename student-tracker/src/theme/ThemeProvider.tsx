import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { PALETTES } from './palettes';
import { loadThemePreference, saveThemePreference } from './preferenceStore';
import { ThemeContext } from './ThemeContext';
import type { ColorScheme, ThemePreference } from './types';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(loadThemePreference);

  const scheme: ColorScheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    saveThemePreference(next);
  }, []);

  const value = useMemo(
    () => ({ colors: PALETTES[scheme], scheme, preference, setPreference }),
    [scheme, preference, setPreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
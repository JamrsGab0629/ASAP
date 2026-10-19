import Storage from 'expo-sqlite/kv-store';
import type { ThemePreference } from './types';

const KEY = 'theme-preference';
const VALID: string[] = ['system', 'light', 'dark'];

export function loadThemePreference(): ThemePreference {
  try {
    const stored = Storage.getItemSync(KEY);
    return stored && VALID.includes(stored) ? (stored as ThemePreference) : 'system';
  } catch {
    return 'system';
  }
}

export function saveThemePreference(preference: ThemePreference): void {
  try {
    Storage.setItemSync(KEY, preference);
  } catch (error) {
    console.warn('Could not save theme preference', error);
  }
}
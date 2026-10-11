import * as SecureStore from 'expo-secure-store';
import type { ThemeMode } from '@/constants/theme';

/** User's appearance choice. `system` follows the phone setting. */
export type ThemePreference = ThemeMode | 'system';

const THEME_KEY = 'wbn-invest-theme';

export async function loadThemePreference(): Promise<ThemePreference> {
  const raw = await SecureStore.getItemAsync(THEME_KEY);
  return raw === 'light' || raw === 'dark' ? raw : 'system';
}

export async function saveThemePreference(preference: ThemePreference): Promise<void> {
  await SecureStore.setItemAsync(THEME_KEY, preference);
}

/** Resolve the effective mode from preference + phone scheme. */
export function resolveThemeMode(
  preference: ThemePreference,
  systemScheme: string | null | undefined,
): ThemeMode {
  if (preference === 'light' || preference === 'dark') return preference;
  return systemScheme === 'dark' ? 'dark' : 'light';
}

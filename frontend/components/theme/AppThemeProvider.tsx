import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme as useDeviceScheme } from '@/components/useColorScheme';
import type { ThemeMode } from '@/constants/theme';
import {
  loadThemePreference,
  resolveThemeMode,
  saveThemePreference,
  type ThemePreference,
} from '@/utils/themePreference';

type AppTheme = {
  /** Raw user choice. */
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  /** Effective mode after resolving `system`. */
  mode: ThemeMode;
  isDark: boolean;
};

const ThemeContext = createContext<AppTheme | null>(null);

/**
 * Owns the appearance setting. Loads the saved choice (default `system`),
 * resolves it against the phone scheme, and exposes a setter that persists.
 * Must wrap everything that calls `useThemeMode` / `useAppTheme`.
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useDeviceScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    loadThemePreference().then(setPreferenceState);
  }, []);

  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p);
    saveThemePreference(p).catch(() => {});
  };

  const mode = resolveThemeMode(preference, systemScheme);

  return (
    <ThemeContext.Provider value={{ preference, setPreference, mode, isDark: mode === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): AppTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Outside the provider (should not happen under root layout) — follow system.
    return { preference: 'system', setPreference: () => {}, mode: 'light', isDark: false };
  }
  return ctx;
}

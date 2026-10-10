import { useColorScheme } from 'nativewind';
import type { ThemeMode } from '@/constants/theme';

/** System theme mode, normalised to 'light' | 'dark'. Matches GluestackUIProvider mode. */
export function useThemeMode(): { mode: ThemeMode; isDark: boolean } {
  const { colorScheme } = useColorScheme();
  const mode: ThemeMode = colorScheme === 'dark' ? 'dark' : 'light';
  return { mode, isDark: mode === 'dark' };
}

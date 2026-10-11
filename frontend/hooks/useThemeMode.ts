import { useAppTheme } from '@/components/theme/AppThemeProvider';
import type { ThemeMode } from '@/constants/theme';

/**
 * Effective theme mode. Follows the user's Appearance setting
 * (Light / Dark / System), not just the phone scheme.
 */
export function useThemeMode(): { mode: ThemeMode; isDark: boolean } {
  const { mode, isDark } = useAppTheme();
  return { mode, isDark };
}

import type { LucideIcon } from 'lucide-react-native';
import { brandInk } from '@/constants/theme';
import { useThemeMode } from '@/hooks/useThemeMode';

type ThemedIconProps = {
  icon: LucideIcon;
  size?: number;
  /** Overrides the automatic foreground color. */
  color?: string;
};

/** Lucide icon painted in the theme foreground color. Centralises all icon coloring. */
export function ThemedIcon({ icon: Icon, size = 22, color }: ThemedIconProps) {
  const { isDark } = useThemeMode();
  return <Icon size={size} color={color ?? (isDark ? '#F1F5F9' : brandInk[950])} />;
}

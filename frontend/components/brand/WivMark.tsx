import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useThemeMode } from '@/hooks/useThemeMode';

type WivMarkProps = {
  size?: 'md' | 'lg';
  /** onGradient: white (default) · onSurface: theme-aware foreground. Explicit colors win. */
  tone?: 'onGradient' | 'onSurface';
  color?: string;
  subColor?: string;
};

const SIZES = {
  md: { mark: 'text-2xl', sub: 'text-sm' },
  lg: { mark: 'text-4xl', sub: 'text-base' },
} as const;

/**
 * No-background WIV wordmark — italic monogram + wbn-Invest. Never renders a box.
 * Same mark used on the glass bank cards, auth heroes, contribution pill and drawer.
 */
export function WivMark({ size = 'md', tone = 'onGradient', color, subColor }: WivMarkProps) {
  const { isDark } = useThemeMode();
  const s = SIZES[size];
  const fg = color ?? (tone === 'onGradient' ? '#fff' : isDark ? '#F1F5F9' : '#0A0F1E');
  const sub =
    subColor ??
    (tone === 'onGradient' ? 'rgba(255,255,255,0.8)' : isDark ? '#94A3B8' : '#64748B');
  return (
    <HStack className="items-center gap-1.5">
      <Text style={{ color: fg }} className={`${s.mark} font-extrabold italic tracking-tight`}>
        WIV
      </Text>
      <Text style={{ color: sub }} className={`${s.sub} font-medium`}>
        wbn-Invest
      </Text>
    </HStack>
  );
}

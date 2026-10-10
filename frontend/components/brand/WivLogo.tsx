import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

type WivLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'tile' | 'tile-wordmark' | 'mono';
  dark?: boolean;
};

const SIZES = {
  sm: { mark: 'text-sm', word: 'text-base' },
  md: { mark: 'text-base', word: 'text-lg' },
  lg: { mark: 'text-xl', word: 'text-2xl' },
} as const;

/**
 * WIV test-combo logo. Text-based, no image asset — and NEVER a background box.
 * tile: bare italic monogram · tile-wordmark: monogram + "wbn-Invest" · mono: single-color mark.
 * (For the gradient wordmark with sub-label, prefer WivMark.)
 */
export function WivLogo({ size = 'md', variant = 'tile-wordmark', dark = false }: WivLogoProps) {
  const s = SIZES[size];
  const markColor = dark ? 'text-white' : 'text-primary';

  const mark = (
    <Text className={`${s.mark} font-extrabold italic tracking-tight ${markColor}`}>WIV</Text>
  );

  if (variant === 'tile' || variant === 'mono') return mark;

  return (
    <HStack className="items-center gap-2">
      {mark}
      <Text className={`${s.word} font-bold tracking-tight text-foreground`}>
        wbn-<Text className="text-primary">Invest</Text>
      </Text>
    </HStack>
  );
}

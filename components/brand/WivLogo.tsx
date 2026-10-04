import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

type WivLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'tile' | 'tile-wordmark' | 'mono';
  dark?: boolean;
};

const TILE: Record<NonNullable<WivLogoProps['size']>, { box: string; mark: string; word: string }> = {
  sm: { box: 'h-8 w-8 rounded-lg', mark: 'text-sm', word: 'text-base' },
  md: { box: 'h-11 w-11 rounded-xl', mark: 'text-base', word: 'text-lg' },
  lg: { box: 'h-14 w-14 rounded-2xl', mark: 'text-xl', word: 'text-2xl' },
};

/**
 * WIV test-combo logo. Text-based, no image asset.
 * tile: blue monogram tile · tile-wordmark: tile + "wbn-Invest" · mono: single color for heroes.
 */
export function WivLogo({ size = 'md', variant = 'tile-wordmark', dark = false }: WivLogoProps) {
  const s = TILE[size];

  if (variant === 'mono') {
    return (
      <Text className={`${s.word} font-extrabold tracking-tight ${dark ? 'text-white' : 'text-primary'}`}>
        WIV
      </Text>
    );
  }

  const tile = (
    <Box className={`${s.box} items-center justify-center bg-primary`}>
      <Text className={`${s.mark} font-extrabold tracking-tight text-white`}>WIV</Text>
    </Box>
  );

  if (variant === 'tile') return tile;

  return (
    <HStack className="items-center gap-2">
      {tile}
      <Text className={`${s.word} font-bold tracking-tight text-foreground`}>
        wbn-<Text className="text-primary">Invest</Text>
      </Text>
    </HStack>
  );
}

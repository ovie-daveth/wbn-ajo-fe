import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

type WivMarkProps = {
  size?: 'md' | 'lg';
  color?: string;
  subColor?: string;
};

const SIZES = {
  md: { mark: 'text-2xl', sub: 'text-sm' },
  lg: { mark: 'text-4xl', sub: 'text-base' },
} as const;

/**
 * No-background WIV wordmark — italic monogram + wbn-Invest.
 * Same mark used on the glass bank cards. For use on gradients/images only.
 */
export function WivMark({ size = 'md', color = '#fff', subColor = 'rgba(255,255,255,0.8)' }: WivMarkProps) {
  const s = SIZES[size];
  return (
    <HStack className="items-center gap-1.5">
      <Text style={{ color }} className={`${s.mark} font-extrabold italic tracking-tight`}>
        WIV
      </Text>
      <Text style={{ color: subColor }} className={`${s.sub} font-medium`}>
        wbn-Invest
      </Text>
    </HStack>
  );
}

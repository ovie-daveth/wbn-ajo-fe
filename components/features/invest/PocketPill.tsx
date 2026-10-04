import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { GlassCard } from '@/components/common/GlassCard';
import { MoneyText } from '@/components/common/MoneyText';
import { WivLogo } from '@/components/brand/WivLogo';
import { rates } from '@/constants/rates';
import { formatMoney } from '@/utils/format';

type PocketPillProps = {
  name?: string;
  tag?: string;
  amount?: number;
};

/** Frosted contributions pill on the hero gradient. Defaults to the monthly tier from `rates`. */
export function PocketPill({ name = 'Contributions', tag = 'October · Paid', amount = rates.monthlyContribution }: PocketPillProps) {
  return (
    <GlassCard className="mx-5 mt-5 p-4">
      <HStack className="items-center gap-3">
        <WivLogo size="sm" variant="tile" />
        <VStack className="flex-1 gap-0">
          <Text className="text-[15px] font-bold text-white">{name}</Text>
          <Text className="text-xs text-white/70">{tag}</Text>
        </VStack>
        <MoneyText size="title" className="text-white">
          {formatMoney(amount)}
        </MoneyText>
      </HStack>
    </GlassCard>
  );
}

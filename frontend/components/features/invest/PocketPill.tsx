import { AppCard } from '@/components/common/AppCard';
import { MoneyText } from '@/components/common/MoneyText';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { rates } from '@/constants/rates';
import { formatMoney } from '@/utils/format';

type PocketPillProps = {
  name?: string;
  tag?: string;
  amount?: number;
};

/** Contributions summary card. Defaults to the monthly tier from `rates`. */
export function PocketPill({ name = 'Contributions', tag = 'October · Paid', amount = rates.monthlyContribution }: PocketPillProps) {
  return (
    <AppCard className="p-4">
      <HStack className="items-center gap-3">
        <VStack className="flex-1 gap-0">
          <Text className="text-[15px] font-bold">{name}</Text>
          <Text className="text-xs text-typography-gray">{tag}</Text>
        </VStack>
        <MoneyText size="title">{formatMoney(amount)}</MoneyText>
      </HStack>
    </AppCard>
  );
}

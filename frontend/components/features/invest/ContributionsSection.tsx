import { Check } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { AppCard } from '@/components/common/AppCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { rates } from '@/constants/rates';
import { formatWholeNaira } from '@/utils/format';

type Due = { name: string; amount: number; status: string; overdue?: boolean };

const DEFAULT_DUES: Due[] = [
  { name: 'Weekly Contribution', amount: rates.weeklyContribution, status: 'Paid' },
  { name: 'October Dues', amount: rates.monthlyContribution, status: 'Due Friday', overdue: true },
];

/** Member dues. Weekly/monthly contributions prove continued membership for loan access. */
export function ContributionsSection({
  dues = DEFAULT_DUES,
  onContribute,
}: {
  dues?: Due[];
  onContribute?: () => void;
}) {
  return (
    <VStack className="gap-2">
      <SectionHeader title="Contributions" actionLabel="Contribute" onAction={onContribute} />
      <Text className="text-xs text-typography-gray">
        Weekly and monthly dues keep your membership active
      </Text>
      <AppCard className="p-2">
        {dues.map((d) => (
          <HStack key={d.name} className="items-center gap-3 p-3">
            <Box className="h-10 w-10 items-center justify-center rounded-full bg-primary">
              <ThemedIcon icon={Check} size={18} color="#fff" />
            </Box>
            <Text className="flex-1 text-sm font-semibold">{d.name}</Text>
            <VStack className="items-end gap-0">
              <Text className="text-sm font-bold">{formatWholeNaira(d.amount)}</Text>
              <Text
                className={`text-[11px] ${d.overdue ? 'font-semibold text-primary' : 'text-typography-gray'}`}
              >
                {d.status}
              </Text>
            </VStack>
          </HStack>
        ))}
      </AppCard>
    </VStack>
  );
}

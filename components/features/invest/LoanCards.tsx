import { Briefcase, Zap } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { AppCard } from '@/components/common/AppCard';
import { RateText } from '@/components/common/MoneyText';
import { formatApr, formatWholeNaira } from '@/utils/format';

/** Member loan products. The co-op lends at APR — it pays no interest on savings. */
export function LoanCards() {
  return (
    <HStack className="gap-3">
      <AppCard className="flex-1">
        <VStack className="gap-2">
          <HStack className="items-center gap-2">
            <Box className="h-9 w-9 items-center justify-center rounded-full bg-primary">
              <ThemedIcon icon={Zap} size={18} color="#fff" />
            </Box>
            <Text className="text-sm font-bold">Emergency Loan</Text>
          </HStack>
          <RateText>from {formatApr(3)}</RateText>
          <Text className="text-xs text-typography-gray">Up to {formatWholeNaira(200000)}</Text>
        </VStack>
      </AppCard>
      <AppCard className="flex-1">
        <VStack className="gap-2">
          <HStack className="items-center gap-2">
            <Box className="h-9 w-9 items-center justify-center rounded-full bg-primary">
              <ThemedIcon icon={Briefcase} size={18} color="#fff" />
            </Box>
            <Text className="text-sm font-bold">Business Loan</Text>
          </HStack>
          <RateText>from {formatApr(5)}</RateText>
          <Text className="text-xs text-typography-gray">Up to {formatWholeNaira(1000000)}</Text>
        </VStack>
      </AppCard>
    </HStack>
  );
}

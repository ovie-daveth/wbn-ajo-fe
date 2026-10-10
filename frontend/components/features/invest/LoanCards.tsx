import { Briefcase, Zap } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { AppCard } from '@/components/common/AppCard';
import { RateText } from '@/components/common/MoneyText';
import { rates } from '@/constants/rates';
import { formatApr, formatWholeNaira } from '@/utils/format';

/**
 * Member loan products. The co-op lends at APR — it pays no interest on savings.
 * Chip stacked above the title so long names/APR figures can never overflow
 * the half-width cards on narrow phones. All figures from `rates`.
 */
export function LoanCards() {
  return (
    <HStack className="gap-3">
      <AppCard className="min-w-0 flex-1 px-4">
        <VStack className="gap-2">
          <Box className="h-9 w-9 items-center justify-center rounded-full bg-primary">
            <ThemedIcon icon={Zap} size={18} color="#fff" />
          </Box>
          <Text className="text-[13px] font-bold leading-tight">Emergency Loan</Text>
          <RateText>from {formatApr(rates.emergencyLoanApr)}</RateText>
          <Text className="text-[11px] text-typography-gray">Up to {formatWholeNaira(rates.emergencyLoanMax)}</Text>
        </VStack>
      </AppCard>
      <AppCard className="min-w-0 flex-1 px-4">
        <VStack className="gap-2">
          <Box className="h-9 w-9 items-center justify-center rounded-full bg-primary">
            <ThemedIcon icon={Briefcase} size={18} color="#fff" />
          </Box>
          <Text className="text-[13px] font-bold leading-tight">Business Loan</Text>
          <RateText>from {formatApr(rates.businessLoanApr)}</RateText>
          <Text className="text-[11px] text-typography-gray">Up to {formatWholeNaira(rates.businessLoanMax)}</Text>
        </VStack>
      </AppCard>
    </HStack>
  );
}

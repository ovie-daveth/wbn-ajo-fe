import { Pressable } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { MoneyText } from '@/components/common/MoneyText';
import { formatMoney } from '@/utils/format';

type BalanceHeaderProps = {
  balance?: number;
  caption?: string;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
};

/** Menu + bell row with centered contributions total. Lives on the hero gradient (white icons/text). */
export function BalanceHeader({
  balance = 85500,
  caption = 'Total contributions · Active member',
  onMenuPress,
  onNotificationsPress,
}: BalanceHeaderProps) {
  return (
    <VStack className="gap-4 px-5 pt-2">
      <HStack className="items-center justify-between">
        <Pressable onPress={onMenuPress} accessibilityLabel="Open menu" hitSlop={8}>
          <Box className="h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/25">
            <Menu size={20} color="#fff" />
          </Box>
        </Pressable>
        <Pressable onPress={onNotificationsPress} accessibilityLabel="Notifications" hitSlop={8}>
          <Box className="h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/25">
            <Bell size={20} color="#fff" />
          </Box>
        </Pressable>
      </HStack>
      <VStack className="items-center gap-0.5">
        <MoneyText size="display" className="text-white">
          {formatMoney(balance)}
        </MoneyText>
        <Text className="text-sm text-white/70">{caption}</Text>
      </VStack>
    </VStack>
  );
}

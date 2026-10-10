import { Pressable } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { MoneyText } from '@/components/common/MoneyText';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { formatMoney } from '@/utils/format';

type BalanceHeaderProps = {
  balance?: number;
  caption?: string;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
};

/** Menu + bell row with centered contributions total. Plain surface. */
export function BalanceHeader({
  balance = 85500,
  caption = 'Total contributions · Active member',
  onMenuPress,
  onNotificationsPress,
}: BalanceHeaderProps) {
  return (
    <VStack className="gap-4">
      <HStack className="items-center justify-between">
        <Pressable
          onPress={onMenuPress}
          accessibilityLabel="Open menu"
          hitSlop={8}
          android_ripple={{ color: 'rgba(47,103,246,0.15)', borderless: true }}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Box className="h-11 w-11 items-center justify-center rounded-full bg-secondary">
            <ThemedIcon icon={Menu} size={20} />
          </Box>
        </Pressable>
        <Pressable
          onPress={onNotificationsPress}
          accessibilityLabel="Notifications"
          hitSlop={8}
          android_ripple={{ color: 'rgba(47,103,246,0.15)', borderless: true }}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Box className="h-11 w-11 items-center justify-center rounded-full bg-secondary">
            <ThemedIcon icon={Bell} size={20} />
          </Box>
        </Pressable>
      </HStack>
      <VStack className="items-center gap-0.5">
        <MoneyText size="display">{formatMoney(balance)}</MoneyText>
        <Text className="text-sm text-typography-gray">{caption}</Text>
      </VStack>
    </VStack>
  );
}

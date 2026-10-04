import { Pressable } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { ThemedIcon } from '@/components/common/ThemedIcon';

type QuickActionProps = {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
};

/** 64pt icon tile + label. Used for Deposit / Withdraw / Brain / Splitter. */
export function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={4}>
      <VStack className="w-[68px] items-center gap-2">
        <Box className="h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <ThemedIcon icon={icon} size={24} />
        </Box>
        <Text className="text-center text-xs font-medium text-foreground">{label}</Text>
      </VStack>
    </Pressable>
  );
}

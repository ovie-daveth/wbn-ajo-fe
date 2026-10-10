import type { LucideIcon } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { AppButton } from '@/components/common/AppButton';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Placeholder / coming-soon state. Used by Home (designed later), Analysis, Wallet tabs. */
export function EmptyState({ icon, title, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <VStack className="items-center gap-3 px-8 py-12">
      <Box className="h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <ThemedIcon icon={icon} size={28} />
      </Box>
      <Heading className="text-center text-xl">{title}</Heading>
      {body && <Text className="text-center text-sm text-typography-gray">{body}</Text>}
      {actionLabel && onAction && (
        <AppButton title={actionLabel} onPress={onAction} variant="outline" shape="rounded" />
      )}
    </VStack>
  );
}

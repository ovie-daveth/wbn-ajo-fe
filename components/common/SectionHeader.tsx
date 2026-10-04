import { Pressable } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** "Pockets …………… Create" pattern. */
export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <HStack className="items-center justify-between">
      <Heading className="text-lg font-bold">{title}</Heading>
      {actionLabel && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-sm font-semibold text-primary">{actionLabel}</Text>
        </Pressable>
      )}
    </HStack>
  );
}

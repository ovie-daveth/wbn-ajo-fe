import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { GlassCard } from '@/components/common/GlassCard';
import { formatWholeNaira } from '@/utils/format';

/** Frosted contribution preview for onboarding screen 2. Decorative. */
export function ContributionPreview() {
  return (
    <View className="w-full flex-row gap-3" accessible={false}>
      <GlassCard className="flex-1 p-4">
        <VStack className="gap-1">
          <Text className="text-sm font-bold text-white">Weekly</Text>
          <Text className="text-lg font-extrabold text-white">{formatWholeNaira(5000)}</Text>
          <Text className="text-[11px] text-white/70">Keeps you active</Text>
        </VStack>
      </GlassCard>
      <GlassCard className="mt-6 flex-1 p-4">
        <VStack className="gap-1">
          <Text className="text-sm font-bold text-white">Monthly</Text>
          <Text className="text-lg font-extrabold text-white">{formatWholeNaira(20000)}</Text>
          <Text className="text-[11px] text-white/70">Builds eligibility</Text>
        </VStack>
      </GlassCard>
    </View>
  );
}

import { WivMark } from '@/components/brand/WivMark';
import { GlassCard } from '@/components/common/GlassCard';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { View } from 'react-native';

/**
 * Two fanned frosted bank cards, WIV-branded. Decorative.
 * Tops splay apart, bottoms converge. Percentage widths so narrow phones never clip.
 */
export function BankCardStack() {
  return (
    <View className="relative h-64 w-full" accessible={false}>
      {/* Back card — low left, tilted left. */}
      <View className="absolute -bottom-7 left-10 w-[64%]" style={{ transform: [{ rotate: '0deg' }] }}>
        <GlassCard className="p-4 w-60">
          <VStack className="gap-3">
            <WivMark />
            <VStack className="gap-0.5">
              <Text className="text-[10px] text-white/70">Card Number</Text>
              <Text className="text-sm font-semibold tracking-widest text-white">1234 5678 9012 3456</Text>
            </VStack>
            <HStack className="justify-between">
              <Text className="text-[10px] text-white/70">Expiry  12/28</Text>
              <Text className="text-[10px] font-bold text-white">WIV</Text>
            </HStack>
          </VStack>
        </GlassCard>
      </View>
      {/* Front card — high right, tilted right, rendered on top. */}
      <View className="absolute -right-2 top-0 w-[64%]" style={{ transform: [{ rotate: '0deg' }] }}>
        <GlassCard className="p-4 w-60">
          <VStack className="gap-3">
            <WivMark />
            <VStack className="gap-0.5">
              <Text className="text-[10px] text-white/70">Card Number</Text>
              <Text className="text-sm font-semibold tracking-widest text-white">1234 5678 9012 3456</Text>
            </VStack>
            <HStack className="justify-between">
              <Text className="text-[10px] text-white/70">Expiry  12/28</Text>
              <Text className="text-[10px] font-bold text-white">WIV</Text>
            </HStack>
          </VStack>
        </GlassCard>
      </View>
    </View>
  );
}

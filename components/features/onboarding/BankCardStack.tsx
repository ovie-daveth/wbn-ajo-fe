import { GlassCard } from '@/components/common/GlassCard';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { View } from 'react-native';

/** Two overlapping frosted bank cards, WIV-branded. Decorative. */
export function BankCardStack() {
  return (
    <View className="relative h-72 w-full" accessible={false}>
      {/* Back card — low left, tilted left. Tops splay apart, bottoms converge. */}
      <View className="absolute left-12 top-40" style={{ transform: [{ rotate: '15deg' }] }}>
        <GlassCard className="w-60 h-40 p-4 ">
          <VStack className="gap-3">
            <CardBrand />
            <VStack className="gap-0.5 mt-5">
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
      <View className="absolute left-40 top-4" style={{ transform: [{ rotate: '15deg' }] }}>
        <GlassCard className="w-60 h-40 p-4">
          <VStack className="gap-3">
            <CardBrand />
            <VStack className="gap-0.5 mt-5">
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

function CardBrand() {
  return (
    <HStack className="items-center gap-1.5">
      <Text className="text-base font-extrabold italic text-white">WIV</Text>
      <Text className="text-xs font-medium text-white/80">wbn-Invest</Text>
    </HStack>
  );
}

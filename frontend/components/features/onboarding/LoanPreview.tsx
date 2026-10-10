import { GlassCard } from '@/components/common/GlassCard';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { rates } from '@/constants/rates';
import { formatApr, formatWholeNaira } from '@/utils/format';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { BadgeCheck, ShieldCheck } from 'lucide-react-native';

function EligibilityBar() {
  const p = useSharedValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      p.value = 0.85;
      return;
    }
    p.value = withDelay(450, withTiming(0.85, { duration: 1100, easing: Easing.out(Easing.cubic) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const fill = useAnimatedStyle(() => ({ width: `${Math.max(0.05, p.value) * 100}%` }));

  return (
    <VStack className="gap-1.5">
      <HStack className="items-center justify-between">
        <Text className="text-[11px] font-semibold text-white/80">Eligibility</Text>
        <Text className="text-[11px] font-extrabold text-white">85%</Text>
      </HStack>
      <View className="h-2 w-full overflow-hidden rounded-full bg-white/20">
        <Animated.View style={fill} className="h-full rounded-full bg-emerald-300" />
      </View>
    </VStack>
  );
}

/**
 * Simple illustration: member-loan card with eligibility bar
 * and APR pills. Decorative — figures from `rates`.
 */
export function LoanPreview() {
  return (
    <View className="w-full max-w-[320px]" accessible={false}>
      <Animated.View entering={FadeInUp.delay(80).duration(400)}>
        <GlassCard className="w-full p-4">
          <VStack className="gap-2.5">
            <HStack className="items-center justify-between">
              <HStack className="items-center gap-2">
                <View className="rounded-full bg-white/20 p-1.5">
                  <ShieldCheck size={14} color="#fff" />
                </View>
                <Text className="text-[13px] font-bold text-white">Member Loan</Text>
              </HStack>
              <HStack className="items-center gap-1 rounded-full bg-emerald-300/90 px-2.5 py-1">
                <BadgeCheck size={11} color="#065F46" />
                <Text className="text-[10px] font-extrabold text-emerald-900">Unlocked</Text>
              </HStack>
            </HStack>

            <Animated.View entering={ZoomIn.delay(250).springify()}>
              <VStack className="gap-0.5">
                <Text className="text-[26px] font-extrabold tracking-tight text-white">
                  {formatWholeNaira(rates.headlineLoanMax)}
                </Text>
                <Text className="text-xs text-white/70">
                  Borrow up to · from {formatApr(rates.emergencyLoanApr)}
                </Text>
              </VStack>
            </Animated.View>

            <EligibilityBar />

            <HStack className="gap-2">
              <Animated.View entering={ZoomIn.delay(550).springify()}>
                <Text className="rounded-full bg-white/25 px-3 py-1.5 text-[11px] font-semibold text-white">
                  Emergency {rates.emergencyLoanApr}%
                </Text>
              </Animated.View>
              <Animated.View entering={ZoomIn.delay(650).springify()}>
                <Text className="rounded-full bg-white/25 px-3 py-1.5 text-[11px] font-semibold text-white">
                  Business {rates.businessLoanApr}%
                </Text>
              </Animated.View>
            </HStack>
          </VStack>
        </GlassCard>
      </Animated.View>
    </View>
  );
}

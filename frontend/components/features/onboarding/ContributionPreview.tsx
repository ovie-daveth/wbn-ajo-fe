import { GlassCard } from '@/components/common/GlassCard';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { rates } from '@/constants/rates';
import { formatWholeNaira } from '@/utils/format';
import { BadgeCheck, CalendarCheck, Flame } from 'lucide-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

function AnimatedBar({ delay = 300, target = 0.85 }: { delay?: number; target?: number }) {
  const p = useSharedValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      p.value = target;
      return;
    }
    p.value = withDelay(delay, withTiming(target, { duration: 1000, easing: Easing.out(Easing.cubic) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const bar = useAnimatedStyle(() => ({ width: `${Math.max(0.04, p.value) * 100}%` }));
  return (
    <View className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
      <Animated.View style={bar} className="h-full rounded-full bg-white" />
    </View>
  );
}

/**
 * Simple illustration: weekly / monthly cards with filling bars
 * and a streak pill. Decorative — figures from `rates`.
 */
export function ContributionPreview() {
  return (
    <VStack className="w-full max-w-[320px] gap-3" accessible={false}>
      <View className="w-full flex-row gap-3">
        <Animated.View entering={SlideInLeft.delay(80).duration(400)} className="flex-1">
          <GlassCard className="p-3.5">
            <VStack className="gap-1.5">
              <HStack className="items-center justify-between">
                <View className="rounded-full bg-white/20 p-1.5">
                  <CalendarCheck size={13} color="#fff" />
                </View>
                <BadgeCheck size={14} color="#fff" />
              </HStack>
              <Text className="text-[13px] font-bold text-white">Weekly</Text>
              <Text className="text-base font-extrabold text-white">
                {formatWholeNaira(rates.weeklyContribution)}
              </Text>
              <AnimatedBar delay={350} target={0.9} />
              <Text className="text-[10px] text-white/70">Keeps you active</Text>
            </VStack>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={SlideInRight.delay(180).duration(400)} className="flex-1">
          <GlassCard className="p-3.5">
            <VStack className="gap-1.5">
              <HStack className="items-center justify-between">
                <View className="rounded-full bg-white/20 p-1.5">
                  <CalendarCheck size={13} color="#fff" />
                </View>
                <BadgeCheck size={14} color="#fff" />
              </HStack>
              <Text className="text-[13px] font-bold text-white">Monthly</Text>
              <Text className="text-base font-extrabold text-white">
                {formatWholeNaira(rates.monthlyContribution)}
              </Text>
              <AnimatedBar delay={500} target={0.65} />
              <Text className="text-[10px] text-white/70">Builds eligibility</Text>
            </VStack>
          </GlassCard>
        </Animated.View>
      </View>

      <Animated.View entering={ZoomIn.delay(450).springify()} className="items-center mt-5">
        <HStack className="items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-lg">
          <Flame size={13} color="#EA580C" />
          <Text className="text-xs font-extrabold text-typography-black">
            4-week streak · unlocks loans
          </Text>
        </HStack>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(120).duration(400)} className="items-center">
        <Text className="text-xs font-semibold text-white/85">2,400 members contributing</Text>
      </Animated.View>
    </VStack>
  );
}

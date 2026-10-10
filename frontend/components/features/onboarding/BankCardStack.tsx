import { WivMark } from '@/components/brand/WivMark';
import { GlassCard } from '@/components/common/GlassCard';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Users } from 'lucide-react-native';
import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  SlideInLeft,
  SlideInRight,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/** Gentle vertical bob. */
function Bob({
  children,
  distance = 6,
  duration = 2800,
  delay = 0,
}: {
  children: ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
}) {
  const p = useSharedValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    p.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }), -1, true),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: p.value * distance }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

/**
 * ₦ coin shuttling left ↔ right between the two cards with a small hop,
 * like it is bouncing from one card to the next.
 */
function BouncingCoin() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // horizontal shuttle: centre → right → centre → left → centre
    x.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    // quick vertical hop
    y.value = withRepeat(
      withTiming(1, { duration: 650, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const style = useAnimatedStyle(() => ({
    transform: [
      // shuttle ±64px horizontally
      { translateX: (x.value * 2 - 1) * 64 },
      // hop up to -14px
      { translateY: y.value * -14 },
    ],
  }));

  return (
    <Animated.View style={style}>
      <View className="h-12 w-12 items-center justify-center rounded-full border-2 border-amber-100 bg-amber-400 shadow-lg">
        <Text className="text-xl font-extrabold text-amber-900">₦</Text>
      </View>
    </Animated.View>
  );
}

/**
 * Simple illustration: two cards gently bobbing, a ₦ coin bouncing
 * between them, and the pooled pill drifting below. Decorative.
 */
export function BankCardStack() {
  return (
    <View className="relative h-56 w-full max-w-[320px]" accessible={false}>
      {/* Back card — low left */}
      <Animated.View
        entering={SlideInLeft.delay(60).duration(400)}
        className="absolute bottom-8 left-0 z-0"
      >
        <Bob distance={6} duration={3000}>
          <View style={{ transform: [{ rotate: '0deg' }] }} className="w-60">
            <GlassCard className="p-3.5">
              <VStack className="gap-2.5">
                <WivMark />
                <VStack className="gap-0.5">
                  <Text className="text-[10px] text-white/70">Card Number</Text>
                  <Text className="text-[13px] font-semibold tracking-widest text-white">
                    1234 5678 9012 3456
                  </Text>
                </VStack>
                <Text className="text-[10px] text-white/70">Expiry 12/28</Text>
              </VStack>
            </GlassCard>
          </View>
        </Bob>
      </Animated.View>

      {/* Front card — high right, on top */}
      <Animated.View
        entering={SlideInRight.delay(140).duration(400)}
        className="absolute right-0 -top-20 z-10"
      >
        <Bob distance={-7} duration={3200} delay={400}>
          <View style={{ transform: [{ rotate: '6deg' }] }} className="w-60">
            <GlassCard className="p-3.5">
              <VStack className="gap-2.5">
                <WivMark />
                <VStack className="gap-0.5">
                  <Text className="text-[10px] text-white/70">Card Number</Text>
                  <Text className="text-[13px] font-semibold tracking-widest text-white">
                    1234 5678 9012 3456
                  </Text>
                </VStack>
                <Text className="text-[10px] text-white/70">Expiry 12/28</Text>
              </VStack>
            </GlassCard>
          </View>
        </Bob>
      </Animated.View>

      {/* ₦ coin bouncing between the cards */}
      <Animated.View
        entering={ZoomIn.delay(300).springify()}
        className="absolute right-20 top-24 z-20 -ml-6"
      >
        <BouncingCoin />
      </Animated.View>

      {/* Pooled pill drifting below */}
      <Animated.View
        entering={ZoomIn.delay(420).springify()}
        className="absolute -bottom-10 left-1/2 z-20 -ml-[78px]"
      >
        <Bob distance={-5} duration={2600} delay={600}>
          <HStack className="items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-lg">
            <View className="rounded-full bg-primary p-1">
              <Users size={12} color="#fff" />
            </View>
            <Text className="text-xs font-extrabold text-typography-black">₦50,000 pooled</Text>
          </HStack>
        </Bob>
      </Animated.View>
    </View>
  );
}

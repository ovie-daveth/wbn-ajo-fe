import { AppButton } from '@/components/common/AppButton';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { heroGradientStops } from '@/constants/theme';
import { useThemeMode } from '@/hooks/useThemeMode';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp, SlideInUp } from 'react-native-reanimated';

type OnboardingShellProps = {
  step: number;
  total?: number;
  title: string;
  body: string;
  visual: ReactNode;
  nextLabel?: string;
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  /** Replaces the default Continue button (screen 3 auth CTAs). */
  footer?: ReactNode;
};

/**
 * Fixed layout: header + flexible visual + pinned bottom sheet.
 * No ScrollView — the sheet (dots, copy, Continue) is always on screen,
 * the visual shrinks on short phones instead of pushing the button off.
 */
export function OnboardingShell({
  step,
  total = 3,
  title,
  body,
  visual,
  nextLabel = 'Continue',
  onNext,
  onBack,
  onSkip,
  footer,
}: OnboardingShellProps) {
  const { mode } = useThemeMode();
  const insets = useSafeAreaInsets();
  // Keep the CTA comfortably above the system nav — inset can be 0 on
  // Android 3-button nav, so enforce a minimum clearance.
  const sheetPaddingBottom = Math.max(insets.bottom, 20) + 16;

  return (
    <View className="flex-1">
      <LinearGradient
        colors={heroGradientStops(mode)}
        locations={[0, 0.45, 0.75, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={['top']}>
        <Animated.View entering={FadeIn.duration(300)}>
          <HStack className="items-center justify-between px-5 pt-1">
            {onBack ? (
              <Pressable
                onPress={onBack}
                hitSlop={12}
                accessibilityLabel="Back"
                className="rounded-full bg-white/15 p-1.5 active:bg-white/25"
              >
                <ChevronLeft size={22} color="#fff" />
              </Pressable>
            ) : (
              <View className="w-[34px]" />
            )}
            {onSkip ? (
              <Pressable
                onPress={onSkip}
                hitSlop={12}
                className="rounded-full bg-white/10 px-4 py-1.5 active:bg-white/20"
              >
                <Text className="text-sm font-semibold text-white">Skip</Text>
              </Pressable>
            ) : (
              <View className="w-[34px]" />
            )}
          </HStack>
        </Animated.View>

        {/* Visual takes remaining space but never pushes the sheet off */}
        <Animated.View
          entering={FadeInUp.delay(60).duration(400)}
          className="min-h-0 flex-1 items-center justify-center px-8 py-2"
        >
          {visual}
        </Animated.View>

        {/* Pinned bottom sheet — always visible, clears the system nav */}
        <Animated.View
          entering={SlideInUp.delay(80).duration(400)}
          style={{ paddingBottom: sheetPaddingBottom }}
          className="gap-3 rounded-t-[28px] bg-background px-6 pt-5"
        >
          <HStack className="items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => {
              const active = i + 1 === step;
              return active ? (
                <Animated.View
                  key={`${step}-${i}`}
                  entering={FadeIn.delay(i * 60).duration(250)}
                  className="h-1.5 w-7 rounded-full bg-primary"
                />
              ) : (
                <View
                  key={`${step}-${i}`}
                  className={
                    i + 1 < step
                      ? 'h-1.5 w-1.5 rounded-full bg-primary/50'
                      : 'h-1.5 w-1.5 rounded-full bg-border'
                  }
                />
              );
            })}
            <Text className="ml-2 text-xs font-semibold text-typography-gray">
              {step} of {total}
            </Text>
          </HStack>
          <Animated.View entering={FadeInUp.delay(140).duration(350)} key={`title-${step}`}>
            <Heading className="text-[24px] font-extrabold leading-tight">{title}</Heading>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(350)} key={`body-${step}`}>
            <Text className="text-[14px] leading-6 text-typography-gray" numberOfLines={3}>
              {body}
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(260).duration(350)}>
            {footer ?? (onNext && <AppButton title={nextLabel} onPress={onNext} variant="dark" />)}
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

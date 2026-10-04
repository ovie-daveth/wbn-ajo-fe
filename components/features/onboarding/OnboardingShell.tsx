import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { AppButton } from '@/components/common/AppButton';
import { heroGradientStops } from '@/constants/theme';
import { useThemeMode } from '@/hooks/useThemeMode';

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

/** Full-screen blue gradient + bottom sheet. Shared by all 3 onboarding screens. */
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

  return (
    <View className="flex-1">
      <LinearGradient
        colors={heroGradientStops(mode)}
        locations={[0, 0.45, 0.75, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <HStack className="items-center justify-between px-5 pt-2">
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={12} accessibilityLabel="Back">
              <ChevronLeft size={26} color="#fff" />
            </Pressable>
          ) : (
            <View className="w-[26px]" />
          )}
          {onSkip && (
            <Pressable onPress={onSkip} hitSlop={12}>
              <Text className="text-sm font-semibold text-white/80">Skip</Text>
            </Pressable>
          )}
        </HStack>

        <View className="flex-1 items-center justify-center px-8">{visual}</View>

        <VStack className="gap-4 rounded-t-[28px] bg-background px-6 pb-10 pt-6">
          <HStack className="gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <View
                key={i}
                className={i + 1 === step ? 'h-1.5 w-6 rounded-full bg-foreground' : 'h-1.5 w-1.5 rounded-full bg-border'}
              />
            ))}
          </HStack>
          <Heading className="text-[28px] font-extrabold leading-tight">{title}</Heading>
          <Text className="text-[15px] leading-6 text-typography-gray">{body}</Text>
          {footer ?? (onNext && <AppButton title={nextLabel} onPress={onNext} variant="dark" />)}
        </VStack>
      </SafeAreaView>
    </View>
  );
}

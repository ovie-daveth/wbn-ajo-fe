import { AppButton } from '@/components/common/AppButton';
import { OnboardingShell } from '@/components/features/onboarding/OnboardingShell';
import { LoanPreview } from '@/components/features/onboarding/LoanPreview';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

export default function OnboardingThree() {
  const enter = () => router.replace('/(tabs)/invest');

  return (
    <OnboardingShell
      step={3}
      title="Low-interest loans for members"
      body="Active members can borrow up to ₦500,000 from just 3% APR. Your contributions keep you eligible."
      visual={<LoanPreview />}
      onBack={() => router.back()}
      footer={
        <VStack className="gap-3">
          <AppButton title="Sign up for free" onPress={enter} variant="dark" />
          <HStack className="items-center justify-center gap-1">
            <Text className="text-sm text-typography-gray">Already signed up?</Text>
            <Pressable onPress={enter} hitSlop={8}>
              <Text className="text-sm font-semibold text-primary">Log in</Text>
            </Pressable>
          </HStack>
        </VStack>
      }
    />
  );
}

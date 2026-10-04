import { BankCardStack } from '@/components/features/onboarding/BankCardStack';
import { OnboardingShell } from '@/components/features/onboarding/OnboardingShell';
import { router } from 'expo-router';

export default function OnboardingOne() {
  return (
    <OnboardingShell
      step={1}
      title="Fund your startup idea"
      body="Community funding is the easiest way to raise money for your startup idea."
      visual={<BankCardStack />}
      onNext={() => router.push('/(onboarding)/two')}
      onSkip={() => router.replace('/(tabs)/home')}
    />
  );
}

import { OnboardingShell } from '@/components/features/onboarding/OnboardingShell';
import { ContributionPreview } from '@/components/features/onboarding/ContributionPreview';
import { router } from 'expo-router';

export default function OnboardingTwo() {
  return (
    <OnboardingShell
      step={2}
      title="Stay active with contributions"
      body="Weekly or monthly contributions show continued membership — and unlock low-interest co-op loans."
      visual={<ContributionPreview />}
      onNext={() => router.push('/(onboarding)/three')}
      onBack={() => router.back()}
      onSkip={() => router.replace('/(tabs)/home')}
    />
  );
}

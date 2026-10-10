import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { EmailOtpJourney } from '@/components/features/auth/EmailOtpJourney';

export default function SignupScreen() {
  const enter = () => router.replace('/(tabs)/home');

  return (
    <EmailOtpJourney
      emailTitle="What's your email?"
      emailBody="One email is all you need. We'll send a 6-digit code to prove it's yours — no passwords to remember."
      codeTitle="Check your inbox"
      socialMode="signup"
      socialLabel="Sign up with Google"
      onAuthenticated={enter}
      footer={
        <HStack className="items-center justify-center gap-1 pt-1">
          <Text className="text-sm text-typography-gray">Already a member?</Text>
          <Pressable onPress={() => router.push('/(auth)/login')} hitSlop={8}>
            <Text className="text-sm font-semibold text-primary">Log in</Text>
          </Pressable>
        </HStack>
      }
    />
  );
}

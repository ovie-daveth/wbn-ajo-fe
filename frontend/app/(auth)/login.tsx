import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { EmailOtpJourney } from '@/components/features/auth/EmailOtpJourney';

export default function LoginScreen() {
  const enter = () => router.replace('/(tabs)/home');

  return (
    <EmailOtpJourney
      emailTitle="Welcome back — what's your email?"
      emailBody="We'll send a fresh 6-digit code every time. No passwords, just your inbox."
      codeTitle="Enter your code"
      socialMode="login"
      socialLabel="Log in with Google"
      onAuthenticated={enter}
      footer={
        <HStack className="items-center justify-center gap-1 pt-1">
          <Text className="text-sm text-typography-gray">New here?</Text>
          <Pressable onPress={() => router.push('/(auth)/signup')} hitSlop={8}>
            <Text className="text-sm font-semibold text-primary">Create account</Text>
          </Pressable>
        </HStack>
      }
    />
  );
}

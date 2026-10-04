import { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { AppButton } from '@/components/common/AppButton';
import { AuthDivider, AuthShell } from '@/components/features/auth/AuthShell';
import { AppleButton, GoogleButton } from '@/components/features/auth/SocialButtons';
import { saveSession } from '@/utils/session';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const enter = () => router.replace('/(tabs)/invest');

  const loginWithEmail = async () => {
    const value = email.trim().toLowerCase();
    if (!value.includes('@')) {
      Alert.alert('Enter a valid email', 'Use the email you signed up with.');
      return;
    }
    setBusy(true);
    try {
      await saveSession({ provider: 'email', userId: value, email: value });
      enter();
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      body="Log in to manage your contributions and member loans."
      footer={
        <HStack className="items-center justify-center gap-1 pt-1">
          <Text className="text-sm text-typography-gray">New here?</Text>
          <Pressable onPress={() => router.push('/(auth)/signup')} hitSlop={8}>
            <Text className="text-sm font-semibold text-primary">Create account</Text>
          </Pressable>
        </HStack>
      }
    >
      <VStack className="gap-1.5">
        <Text className="text-sm font-medium">Email</Text>
        <Input>
          <InputField
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            onSubmitEditing={loginWithEmail}
          />
        </Input>
      </VStack>
      <AppButton title="Log in" onPress={loginWithEmail} loading={busy} variant="dark" />
      <AuthDivider />
      <GoogleButton label="Log in with Google" onAuthenticated={enter} />
      <AppleButton mode="login" onAuthenticated={enter} />
    </AuthShell>
  );
}

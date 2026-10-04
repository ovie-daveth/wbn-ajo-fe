import { AppButton } from '@/components/common/AppButton';
import { AuthDivider, AuthShell } from '@/components/features/auth/AuthShell';
import { PasswordField } from '@/components/features/auth/PasswordField';
import { AppleButton, GoogleButton } from '@/components/features/auth/SocialButtons';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { saveSession } from '@/utils/session';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable } from 'react-native';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const enter = () => router.replace('/(tabs)/home');

  const continueWithEmail = async () => {
    if (name.trim().length < 2) {
      Alert.alert('Enter your name', 'Tell us your full name to create your membership.');
      return;
    }
    if (phone.trim().length < 7) {
      Alert.alert('Enter a valid phone number', 'We need your phone number to reach you about dues and loans.');
      return;
    }
    const value = email.trim().toLowerCase();
    if (!value.includes('@')) {
      Alert.alert('Enter a valid email', 'We need your email to create your membership.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Choose a password', 'Use at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      await saveSession({
        provider: 'email',
        userId: value,
        email: value,
        name: name.trim(),
        phone: phone.trim(),
      });
      enter();
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      body="Join the wbn-Invest cooperative. Contribute weekly or monthly, then borrow at low APR."
      footer={
        <HStack className="items-center justify-center gap-1 pt-1">
          <Text className="text-sm text-typography-gray">Already a member?</Text>
          <Pressable onPress={() => router.push('/(auth)/login')} hitSlop={8}>
            <Text className="text-sm font-semibold text-primary">Log in</Text>
          </Pressable>
        </HStack>
      }
    >
      <VStack className="gap-1.5">
        <Text className="text-sm font-medium">Full name</Text>
        <Input>
          <InputField
            placeholder="Adaeze Okafor"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
          />
        </Input>
      </VStack>
      <VStack className="gap-1.5">
        <Text className="text-sm font-medium">Phone number</Text>
        <Input>
          <InputField
            placeholder="0803 123 4567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
        </Input>
      </VStack>
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
          />
        </Input>
      </VStack>
      <VStack className="gap-1.5">
        <Text className="text-sm font-medium">Password</Text>
        <PasswordField value={password} onChangeText={setPassword} onSubmitEditing={continueWithEmail} />
      </VStack>
      <AppButton  title="Continue with email" onPress={continueWithEmail} loading={busy} variant="dark" />
      <AuthDivider />
      <GoogleButton label="Sign up with Google" onAuthenticated={enter} />
      <AppleButton mode="signup" onAuthenticated={enter} />
    </AuthShell>
  );
}

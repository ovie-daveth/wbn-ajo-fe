import { Alert, Pressable } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Text } from '@/components/ui/text';
import { useAppleAuth } from '@/components/features/auth/useAppleAuth';
import { useGoogleAuth } from '@/components/features/auth/useGoogleAuth';

function showFailure(e: unknown) {
  const message = e instanceof Error ? e.message : 'Sign-in failed. Please try again.';
  if (message !== 'cancelled') Alert.alert('Sign-in failed', message);
}

/**
 * Google button (white, per Google branding — intentionally not themed).
 * Needs OAuth client IDs in .env + a development build (Google rejects Expo Go redirects).
 */
export function GoogleButton({
  label,
  onAuthenticated,
}: {
  label: string;
  onAuthenticated: () => void;
}) {
  const { loading, signIn } = useGoogleAuth();

  const press = async () => {
    if (loading) return;
    try {
      await signIn();
      onAuthenticated();
    } catch (e) {
      showFailure(e);
    }
  };

  return (
    <Pressable
      onPress={press}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-row items-center justify-center gap-3 rounded-full border border-border bg-white py-4 active:opacity-80"
    >
      <Text className="text-xl font-extrabold text-[#4285F4]">G</Text>
      <Text className="text-[15px] font-semibold text-typography-black">
        {loading ? 'Please wait…' : label}
      </Text>
    </Pressable>
  );
}

/**
 * Native Apple button (Apple-approved, auto-localized). Renders nothing where
 * Sign in with Apple is unavailable (Android, old iOS).
 */
export function AppleButton({
  mode,
  onAuthenticated,
}: {
  mode: 'signup' | 'login';
  onAuthenticated: () => void;
}) {
  const { available, loading, signIn } = useAppleAuth();

  if (!available) return null;

  const press = async () => {
    if (loading) return;
    try {
      await signIn();
      onAuthenticated();
    } catch (e) {
      showFailure(e);
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={
        mode === 'signup'
          ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
          : AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
      }
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={999}
      style={{ width: '100%', height: 56 }}
      onPress={press}
    />
  );
}

import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { saveSession, type MemberSession } from '@/utils/session';

/**
 * Sign in with Apple (iOS only — the button renders nothing elsewhere).
 * Works in Expo Go on iOS; standalone builds need the Apple Sign In
 * capability (already set via app.json `usesAppleSignIn` + plugin).
 */
export function useAppleAuth() {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (Platform.OS !== 'ios') return;
      try {
        const ok = await AppleAuthentication.isAvailableAsync();
        if (mounted) setAvailable(ok);
      } catch {
        // Not available on this device — button stays hidden.
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (): Promise<MemberSession> => {
    setLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const session: MemberSession = {
        provider: 'apple',
        userId: credential.user,
        email: credential.email ?? null,
        name: credential.fullName
          ? AppleAuthentication.formatFullName(credential.fullName) || null
          : null,
        idToken: credential.identityToken ?? null,
      };
      await saveSession(session);
      return session;
    } catch (e: any) {
      if (e?.code === 'ERR_REQUEST_CANCELED') throw new Error('cancelled');
      throw e instanceof Error ? e : new Error('Apple sign-in failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { available, loading, signIn };
}

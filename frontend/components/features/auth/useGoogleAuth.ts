import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { saveSession, type MemberSession } from '@/utils/session';

WebBrowser.maybeCompleteAuthSession();

const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '';
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

function resolveClientId(): string {
  if (Platform.OS === 'ios' && IOS_CLIENT_ID) return IOS_CLIENT_ID;
  if (Platform.OS === 'android' && ANDROID_CLIENT_ID) return ANDROID_CLIENT_ID;
  return WEB_CLIENT_ID;
}

// Placeholder keeps Google.useAuthRequest from throwing at render when keys
// are missing. signIn() still refuses to run until real IDs are configured.
const PLACEHOLDER_CLIENT_ID = 'not-configured.apps.googleusercontent.com';

type Pending = { resolve: (s: MemberSession) => void; reject: (e: Error) => void };

/**
 * Google sign-in via expo-auth-session (browser OAuth, code flow with PKCE).
 * Needs Google OAuth client IDs in .env (see .env.example) and a development
 * build — Google rejects Expo Go's exp:// redirects. Apple works in Expo Go.
 */
export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const pending = useRef<Pending | null>(null);
  const configured = Boolean(resolveClientId());

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID || PLACEHOLDER_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID || PLACEHOLDER_CLIENT_ID,
    webClientId: WEB_CLIENT_ID || PLACEHOLDER_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
    redirectUri: makeRedirectUri({ scheme: 'wbninvest', path: 'redirect' }),
  });

  useEffect(() => {
    const current = pending.current;
    if (!current || !response) return;
    pending.current = null;
    setLoading(false);
    (async () => {
      try {
        if (response.type !== 'success') {
          if (response.type === 'error') {
            throw new Error(response.error?.message ?? 'Google sign-in failed.');
          }
          throw new Error('cancelled');
        }
        const accessToken = response.authentication?.accessToken;
        if (!accessToken) throw new Error('Google did not return an access token.');
        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Could not fetch your Google profile.');
        const profile = (await res.json()) as { id?: string; email?: string; name?: string };
        const session: MemberSession = {
          provider: 'google',
          userId: String(profile.id ?? ''),
          email: profile.email ?? null,
          name: profile.name ?? null,
        };
        await saveSession(session);
        current.resolve(session);
      } catch (e) {
        current.reject(e instanceof Error ? e : new Error('Google sign-in failed.'));
      }
    })();
  }, [response]);

  const signIn = useCallback(async (): Promise<MemberSession> => {
    if (!configured) {
      Alert.alert(
        'Google sign-in not configured',
        'Add your Google OAuth client IDs to .env (see .env.example), then restart with: npx expo start -c',
      );
      throw new Error('Google sign-in is not configured.');
    }
    if (!request) throw new Error('Google sign-in is still loading. Try again in a moment.');
    setLoading(true);
    try {
      return await new Promise<MemberSession>((resolve, reject) => {
        pending.current = { resolve, reject };
        promptAsync().catch((e: unknown) => {
          pending.current = null;
          setLoading(false);
          reject(e instanceof Error ? e : new Error('Google sign-in failed.'));
        });
      });
    } catch (e) {
      setLoading(false);
      pending.current = null;
      throw e;
    }
  }, [configured, request, promptAsync]);

  return { loading, configured, signIn };
}

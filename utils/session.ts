import * as SecureStore from 'expo-secure-store';

export type AuthProvider = 'google' | 'apple' | 'email';

export type MemberSession = {
  provider: AuthProvider;
  /** Stable user id: Google sub, Apple user identifier, or email for email flow. */
  userId: string;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  idToken?: string | null;
};

const SESSION_KEY = 'wbn-invest-session';

/** Persisted member session. Swap the body of these for real backend tokens later. */
export async function saveSession(session: MemberSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function loadSession(): Promise<MemberSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MemberSession;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

/**
 * Passwordless email-token auth.
 *
 * DEMO STUB — no backend yet. `requestEmailToken` mints a 6-digit code
 * in memory and `verifyEmailToken` checks it. Nothing is emailed.
 *
 * To wire the real backend later, keep these signatures and replace the
 * bodies with fetch() calls:
 *   requestEmailToken(email) -> POST /auth/email/send { email }
 *   verifyEmailToken(email, code) -> POST /auth/email/verify { email, code }
 * then set DEMO_MODE = false (hides the on-screen demo code).
 */

export const DEMO_MODE = true;

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_SEC = 30;

type Entry = { code: string; expiresAt: number };

const store = new Map<string, Entry>();

const normalize = (email: string) => email.trim().toLowerCase();

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const mintCode = () => String(Math.floor(100000 + Math.random() * 900000));

export type TokenRequest = {
  expiresInSec: number;
  resendCooldownSec: number;
  /** Only set in DEMO_MODE — shown on screen until real emails are wired. */
  demoCode: string | null;
};

/** "Send" a login code to the email address. Throws on network failure. */
export async function requestEmailToken(email: string): Promise<TokenRequest> {
  await wait(800); // simulate network
  const code = mintCode();
  store.set(normalize(email), { code, expiresAt: Date.now() + CODE_TTL_MS });
  return {
    expiresInSec: CODE_TTL_MS / 1000,
    resendCooldownSec: RESEND_COOLDOWN_SEC,
    demoCode: DEMO_MODE ? code : null,
  };
}

/** Verify the code. Throws with a user-facing message when invalid/expired. */
export async function verifyEmailToken(email: string, code: string): Promise<void> {
  await wait(600); // simulate network
  const entry = store.get(normalize(email));
  if (!entry) {
    throw new Error('No code was sent to this email. Go back and send one first.');
  }
  if (Date.now() > entry.expiresAt) {
    store.delete(normalize(email));
    throw new Error('That code expired. Send a fresh one.');
  }
  if (entry.code !== code.trim()) {
    throw new Error('That code does not match. Check your inbox and try again.');
  }
  store.delete(normalize(email));
}

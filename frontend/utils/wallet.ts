import * as SecureStore from 'expo-secure-store';

/**
 * Wallet persistence (demo stub until the backend lands).
 *
 * - Ledger: every contribution / withdrawal, positive display amounts.
 * - Saved cards: brand + last4 + expiry ONLY — full PANs and CVVs are never
 *   stored. Later: store provider token references (Paystack/OPay) instead.
 * - Withdrawal account: the member's own bank account for payouts.
 */

export type LedgerKind = 'contribution' | 'withdrawal';

export type LedgerRecord = {
  kind: LedgerKind;
  amount: number;
  frequency: string;
  method: string;
  at: string;
};

const LEDGER_KEY = 'wbn-invest-contributions';

export async function loadLedger(): Promise<LedgerRecord[]> {
  try {
    const raw = await SecureStore.getItemAsync(LEDGER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<LedgerRecord>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((r) => typeof r?.amount === 'number' && Number.isFinite(r.amount))
      .map((r) => ({
        // Pre-kind records were always contributions.
        kind: r.kind === 'withdrawal' ? 'withdrawal' : ('contribution' as LedgerKind),
        amount: r.amount as number,
        frequency: typeof r.frequency === 'string' ? r.frequency : '',
        method: typeof r.method === 'string' ? r.method : 'Contribution',
        at: typeof r.at === 'string' ? r.at : new Date(0).toISOString(),
      }))
      .sort((a, b) => (a.at < b.at ? 1 : -1));
  } catch {
    return [];
  }
}

export async function recordLedgerEntry(entry: {
  kind: LedgerKind;
  amount: number;
  frequency: string;
  method: string;
}): Promise<void> {
  const raw = await SecureStore.getItemAsync(LEDGER_KEY);
  const list = raw ? (JSON.parse(raw) as unknown[]) : [];
  list.push({ ...entry, at: new Date().toISOString() });
  await SecureStore.setItemAsync(LEDGER_KEY, JSON.stringify(list));
}

/** Contributions in, withdrawals out. */
export function ledgerBalance(records: LedgerRecord[]): number {
  return records.reduce((sum, r) => sum + (r.kind === 'withdrawal' ? -r.amount : r.amount), 0);
}

export type SavedCard = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  holder: string;
  preferred: boolean;
  addedAt: string;
};

const CARDS_KEY = 'wbn-invest-cards';

/** Visa / Mastercard / Verve by BIN prefix — good enough for display. */
export function detectCardBrand(digits: string): string {
  if (/^4/.test(digits)) return 'Visa';
  if (/^5/.test(digits)) return 'Mastercard';
  if (/^(506|507|650)/.test(digits)) return 'Verve';
  return 'Card';
}

export async function loadCards(): Promise<SavedCard[]> {
  try {
    const raw = await SecureStore.getItemAsync(CARDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedCard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function persistCards(cards: SavedCard[]): Promise<void> {
  await SecureStore.setItemAsync(CARDS_KEY, JSON.stringify(cards));
}

/** Saves brand + last4 only. First card becomes preferred automatically. */
export async function addCard(card: {
  brand: string;
  last4: string;
  expiry: string;
  holder: string;
}): Promise<SavedCard[]> {
  const cards = await loadCards();
  if (cards.some((c) => c.last4 === card.last4 && c.expiry === card.expiry)) {
    return cards; // already saved
  }
  const entry: SavedCard = {
    ...card,
    id: `${Date.now()}`,
    preferred: cards.length === 0,
    addedAt: new Date().toISOString(),
  };
  const next = [...cards, entry];
  await persistCards(next);
  return next;
}

export async function removeCard(id: string): Promise<SavedCard[]> {
  const cards = (await loadCards()).filter((c) => c.id !== id);
  if (cards.length > 0 && !cards.some((c) => c.preferred)) {
    cards[0].preferred = true;
  }
  await persistCards(cards);
  return cards;
}

export async function setPreferredCard(id: string): Promise<SavedCard[]> {
  const cards = (await loadCards()).map((c) => ({ ...c, preferred: c.id === id }));
  await persistCards(cards);
  return cards;
}

export type WithdrawAccount = {
  bankName: string;
  accountNumber: string;
  holderName: string;
};

const ACCOUNT_KEY = 'wbn-invest-withdraw-account';

export async function loadWithdrawAccount(): Promise<WithdrawAccount | null> {
  try {
    const raw = await SecureStore.getItemAsync(ACCOUNT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WithdrawAccount;
    if (!parsed?.accountNumber) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveWithdrawAccount(account: WithdrawAccount): Promise<void> {
  await SecureStore.setItemAsync(ACCOUNT_KEY, JSON.stringify(account));
}

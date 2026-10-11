/**
 * Receiving-money details (demo stub).
 *
 * Until the payments backend lands, transfers go to this static virtual
 * account. Later: fetch a per-member dynamic account from
 * POST /payments/transfer-account { amount } instead.
 */
export const demoReceivingAccount = {
  bankName: 'Wema Bank',
  accountNumber: '0123456789',
  accountName: 'WBN Invest — Member Pot',
} as const;

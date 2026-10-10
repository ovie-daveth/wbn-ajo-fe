/**
 * Co-operative rates & tiers — the ONLY place money figures live.
 *
 * Override with EXPO_PUBLIC_* env vars (see .env.example). Values are baked in
 * at startup, so restart the dev server after changing them: `npx expo start -c`.
 *
 * Every screen and component must read from `rates` — never hardcode figures.
 * See DESIGN.md §9 for the full reference table.
 */

function num(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const rates = {
  /** Emergency loan APR, percent (5 = "5.00% APR"). */
  emergencyLoanApr: num(process.env.EXPO_PUBLIC_EMERGENCY_LOAN_APR, 5),
  /** Business loan APR, percent. */
  businessLoanApr: num(process.env.EXPO_PUBLIC_BUSINESS_LOAN_APR, 10),
  /** Headline "borrow up to" figure for marketing copy + previews, naira. */
  headlineLoanMax: num(process.env.EXPO_PUBLIC_HEADLINE_LOAN_MAX, 500000),
  /** Emergency loan cap, naira. */
  emergencyLoanMax: num(process.env.EXPO_PUBLIC_EMERGENCY_LOAN_MAX, 200000),
  /** Business loan cap, naira. */
  businessLoanMax: num(process.env.EXPO_PUBLIC_BUSINESS_LOAN_MAX, 1000000),
  /** Weekly contribution tier, naira. */
  weeklyContribution: num(process.env.EXPO_PUBLIC_WEEKLY_CONTRIBUTION, 5000),
  /** Monthly contribution tier, naira. */
  monthlyContribution: num(process.env.EXPO_PUBLIC_MONTHLY_CONTRIBUTION, 20000),
} as const;

export type Rates = typeof rates;

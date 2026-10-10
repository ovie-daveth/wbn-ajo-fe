/** Money + rate formatting (Naira, cooperative). Single import for every feature. */

export function formatMoney(value: number, currency = '₦'): string {
  return `${currency}${value.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatWholeNaira(value: number, currency = '₦'): string {
  return `${currency}${Math.round(value).toLocaleString('en-NG')}`;
}

/**
 * Loan rates, e.g. "3.00% APR".
 * The co-op charges APR on loans and pays NO interest on savings — never render AER.
 */
export function formatApr(value: number): string {
  return `${value.toFixed(2)}% APR`;
}

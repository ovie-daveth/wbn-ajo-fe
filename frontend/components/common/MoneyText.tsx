import { Text } from '@/components/ui/text';

const MONEY_SIZES = {
  display: 'text-4xl font-extrabold tracking-tight',
  title: 'text-xl font-bold tracking-tight',
  body: 'text-base',
} as const;

export function MoneyText({
  children,
  size = 'body',
  className = '',
}: {
  children: React.ReactNode;
  size?: keyof typeof MONEY_SIZES;
  className?: string;
}) {
  return <Text className={`${MONEY_SIZES[size]} text-foreground ${className}`}>{children}</Text>;
}

/** "3.00% APR" — always bold, inherits surrounding color unless overridden. */
export function RateText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <Text className={`text-sm font-bold text-foreground ${className}`}>{children}</Text>;
}

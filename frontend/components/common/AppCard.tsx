import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

/** Standard surface: rounded-2xl card with border. */
export function AppCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <Card className={`rounded-2xl border-border bg-card p-5 ${className}`}>{children}</Card>;
}

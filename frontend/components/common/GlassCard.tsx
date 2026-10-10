import { Box } from '@/components/ui/box';
import type { ReactNode } from 'react';

/** Frosted white card for content sitting on hero gradients (both modes). */
export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Box className={`rounded-2xl border border-white/30 bg-white/25 ${className}`}>{children}</Box>
  );
}

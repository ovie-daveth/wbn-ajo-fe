import { GlassCard } from '@/components/common/GlassCard';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { formatApr, formatWholeNaira } from '@/utils/format';

/** Frosted member-loan preview for onboarding screen 3. Decorative. */
export function LoanPreview() {
  return (
    <GlassCard className="w-full p-5">
      <VStack className="gap-1">
        <Text className="text-sm font-bold text-white">Member Loan</Text>
        <Text className="text-3xl font-extrabold tracking-tight text-white">
          {formatWholeNaira(15000000)}
        </Text>
        <Text className="text-xs text-white/70">Borrow up to · from {formatApr(5)}</Text>
      </VStack>
      <HStack className="mt-4 gap-2">
        {['Emergency 5%', 'Business 10%'].map((t) => (
          <Text key={t} className="rounded-full bg-white/25 px-3 py-1.5 text-[11px] font-semibold text-white">
            {t}
          </Text>
        ))}
      </HStack>
    </GlassCard>
  );
}

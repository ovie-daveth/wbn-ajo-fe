import { QuickAction } from '@/components/common/QuickAction';
import { HStack } from '@/components/ui/hstack';
import { Banknote, CirclePlus, HandCoins, Receipt } from 'lucide-react-native';

type QuickActionGridProps = {
  onContribute?: () => void;
  onBorrow?: () => void;
  onRepay?: () => void;
  onReceipts?: () => void;
};

/** Contribute / Borrow / Repay / Receipts row. */
export function QuickActionGrid({ onContribute, onBorrow, onRepay, onReceipts }: QuickActionGridProps) {
  return (
    <HStack className="justify-between px-1">
      <QuickAction icon={CirclePlus} label="Contribute" onPress={onContribute} />
      <QuickAction icon={Banknote} label="Loan" onPress={onBorrow} />
      <QuickAction icon={HandCoins} label="Save" onPress={onRepay} />
      <QuickAction icon={Receipt} label="Receipts" onPress={onReceipts} />
    </HStack>
  );
}

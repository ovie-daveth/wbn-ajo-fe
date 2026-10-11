import { AppButton } from '@/components/common/AppButton';
import { BottomSheetModal } from '@/components/common/BottomSheetModal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ShieldCheck } from 'lucide-react-native';
import { View } from 'react-native';

type KycGateModalProps = {
  visible: boolean;
  onClose: () => void;
  onCompleteKyc: () => void;
};

/**
 * Blocks money movement until profile + KYC are done. Bottom sheet with
 * a clear path into the KYC flow. Decorative icon, plain copy.
 */
export function KycGateModal({ visible, onClose, onCompleteKyc }: KycGateModalProps) {
  return (
    <BottomSheetModal visible={visible} onRequestClose={onClose} onBackdropPress={onClose}>
      <VStack className="gap-4">
        <View className="items-center">
          <View className="rounded-full bg-primary p-4">
            <ShieldCheck size={28} color="#fff" />
          </View>
        </View>
        <Heading className="text-center text-[22px] font-extrabold">
          Finish your KYC to contribute
        </Heading>
        <Text className="text-center text-[14px] leading-6 text-typography-gray">
          Co-op rules: only verified members can move money. Finish your profile and identity
          check — it takes about a minute.
        </Text>
        <VStack className="gap-2">
          <AppButton title="Finish KYC" onPress={onCompleteKyc} variant="dark" />
          <AppButton title="Not now" onPress={onClose} variant="ghost" />
        </VStack>
      </VStack>
    </BottomSheetModal>
  );
}

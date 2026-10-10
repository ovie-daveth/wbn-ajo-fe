import { AppButton } from '@/components/common/AppButton';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ShieldCheck } from 'lucide-react-native';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="absolute inset-0" onPress={onClose} accessibilityLabel="Dismiss" />
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 12 }}
          className="gap-4 rounded-t-[28px] bg-background px-6 pt-4"
        >
          <View className="items-center">
            <View className="h-1.5 w-12 rounded-full bg-border" />
          </View>
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
        </View>
      </View>
    </Modal>
  );
}

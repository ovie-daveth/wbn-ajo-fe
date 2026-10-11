import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  /** Tapping the dimmed backdrop. Omit to make it non-dismissable. */
  onBackdropPress?: () => void;
  children: ReactNode;
};

/**
 * Shared bottom sheet: dimmed backdrop + sliding card with grab handle,
 * safe-area clearance and the standard 28px top radius. Used by the KYC
 * gate and the liveness success sheet so every modal looks identical.
 */
export function BottomSheetModal({
  visible,
  onRequestClose,
  onBackdropPress,
  children,
}: BottomSheetModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onRequestClose}>
      <View className="flex-1 justify-end bg-black/50">
        {onBackdropPress && (
          <Pressable
            className="absolute inset-0"
            onPress={onBackdropPress}
            accessibilityLabel="Dismiss"
          />
        )}
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 12 }}
          className="gap-4 rounded-t-[28px] bg-background px-6 pt-4"
        >
          <View className="items-center">
            <View className="h-1.5 w-12 rounded-full bg-border" />
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

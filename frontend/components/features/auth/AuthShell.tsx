import { WivMark } from '@/components/brand/WivMark';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { heroGradientStops } from '@/constants/theme';
import { useThemeMode } from '@/hooks/useThemeMode';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthShellProps = {
  title: string;
  body: string;
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
};

/** Blue hero + WIV mark + bottom sheet. Shared by signup and login. */
export function AuthShell({ title, body, children, footer, onBack }: AuthShellProps) {
  const { mode } = useThemeMode();

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={heroGradientStops(mode)}
        locations={[0, 0.5, 0.8, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 300 }}
      />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <Pressable
          onPress={onBack ?? (() => router.back())}
          accessibilityLabel="Back"
          hitSlop={12}
          className="w-10 items-center px-5 py-2"
        >
          <ChevronLeft size={26} color="#fff" />
        </Pressable>
        <VStack className="items-center py-5">
          <WivMark size="lg" />
        </VStack>
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <VStack className="grow gap-4 rounded-t-[28px] bg-background px-6 pb-10 pt-6">
            <Heading className="text-[26px] font-extrabold leading-tight">{title}</Heading>
            {/* <Text className="text-[15px] leading-6 text-typography-gray">{body}</Text> */}
            {children}
            {footer}
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

/** "———— or ————" divider for stacking auth methods. */
export function AuthDivider({ label = 'or' }: { label?: string }) {
  return (
    <HStack className="items-center gap-3">
      <Divider className="flex-1" />
      <Text className="text-xs font-medium text-typography-gray">{label}</Text>
      <Divider className="flex-1" />
    </HStack>
  );
}

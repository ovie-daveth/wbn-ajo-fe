import { WivMark } from '@/components/brand/WivMark';
import { AppButton } from '@/components/common/AppButton';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { clearSession, type MemberSession } from '@/utils/session';
import { router } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Award, BadgeCheck, LogOut, Mail, Phone, User, X } from 'lucide-react-native';
import { Alert, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeDrawerProps = {
  open: boolean;
  session: MemberSession | null;
  onClose: () => void;
};

function ProfileRow({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <HStack className="items-center gap-3 py-2.5">
      <Box className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
        <ThemedIcon icon={icon} size={18} />
      </Box>
      <VStack className="flex-1 gap-0">
        <Text className="text-[11px] text-typography-gray">{label}</Text>
        <Text className={`text-sm font-semibold ${accent ? 'text-primary' : ''}`}>{value}</Text>
      </VStack>
    </HStack>
  );
}

/**
 * Slide-in profile sidebar. Backdrop tap or X closes it.
 * Grade + KYC are demo values until the backend provides them.
 */
export function HomeDrawer({ open, session, onClose }: HomeDrawerProps) {
  if (!open) return null;

  const name = session?.name?.trim() || 'Member';
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const logout = async () => {
    await clearSession();
    onClose();
    router.replace('/(auth)/login');
  };

  return (
    <Animated.View className="absolute inset-0 z-50">
      <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute inset-0 bg-black/50">
        <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Close menu" />
      </Animated.View>
      <Animated.View
        entering={SlideInLeft.springify().damping(30).stiffness(260)}
        exiting={SlideOutLeft.duration(220)}
        className="absolute bottom-0 left-0 top-0 w-[85%] max-w-[340px] rounded-r-[28px] border-r border-border bg-background"
      >
        <SafeAreaView edges={['top', 'bottom']} className="flex-1">
          <VStack className="flex-1 gap-4 p-5">
            <HStack className="items-center justify-between">
              <WivMark size="md" tone="onSurface" />
              <Pressable onPress={onClose} accessibilityLabel="Close menu" hitSlop={8}>
                <Box className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <ThemedIcon icon={X} size={18} />
                </Box>
              </Pressable>
            </HStack>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <VStack className="items-center gap-2 py-2">
                <Box className="h-20 w-20 items-center justify-center rounded-full bg-primary">
                  <Text className="text-2xl font-extrabold text-white">{initials}</Text>
                </Box>
                <Heading className="text-center text-xl">{name}</Heading>
                <Text className="text-sm text-typography-gray">{session?.email ?? 'No email on file'}</Text>
                <HStack className="mt-1 gap-2">
                  <Badge>
                    <BadgeText>Tier 1</BadgeText>
                  </Badge>
                  <Badge variant="outline">
                    <BadgeText>KYC Unverified</BadgeText>
                  </Badge>
                </HStack>
              </VStack>

              <Divider className="my-2" />

              <ProfileRow icon={User} label="Full name" value={session?.name?.trim() || '—'} />
              <ProfileRow icon={Mail} label="Email" value={session?.email ?? '—'} />
              <ProfileRow icon={Phone} label="Phone number" value={session?.phone ?? 'Not provided'} />
              <ProfileRow icon={Award} label="Account grade" value="Tier 1" />
              <ProfileRow icon={BadgeCheck} label="Verification status (KYC)" value="Unverified" accent />

              <AppButton
                title="Verify identity"
                variant="outline"
                shape="rounded"
                className="mt-3"
                onPress={() => Alert.alert('Coming soon', 'Identity verification will open here.')}
              />
            </ScrollView>

            <Pressable
              onPress={logout}
              accessibilityRole="button"
              accessibilityLabel="Log out"
              className="flex-row items-center justify-center gap-2 rounded-full bg-red-600 py-4 active:opacity-80"
            >
              <LogOut size={18} color="#fff" />
              <Text className="text-[15px] font-semibold text-white">Log out</Text>
            </Pressable>
          </VStack>
        </SafeAreaView>
      </Animated.View>
    </Animated.View>
  );
}

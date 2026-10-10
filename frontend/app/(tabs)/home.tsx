import { HomeDrawer } from '@/components/features/home/HomeDrawer';
import { BalanceHeader } from '@/components/features/invest/BalanceHeader';
import { ContributionsSection } from '@/components/features/invest/ContributionsSection';
import { LoanCards } from '@/components/features/invest/LoanCards';
import { PocketPill } from '@/components/features/invest/PocketPill';
import { QuickActionGrid } from '@/components/features/invest/QuickActionGrid';
import { VStack } from '@/components/ui/vstack';
import { useThemeMode } from '@/hooks/useThemeMode';
import { loadSession, type MemberSession } from '@/utils/session';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Home tab + post-onboarding landing. Renders the Invest dashboard until the
 * real Home design lands (then this moves aside — see DESIGN.md §6.2).
 * Plain system-blended surface — no hero gradient; the tab bar below is
 * a standard in-flow bar, so content just needs normal bottom padding.
 */
export default function HomeScreen() {
  const { mode } = useThemeMode();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [session, setSession] = useState<MemberSession | null>(null);

  useEffect(() => {
    loadSession().then(setSession);
  }, []);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow"
          showsVerticalScrollIndicator={false}
        >
          <VStack className="gap-4 px-5 pb-6 pt-2">
            <BalanceHeader onMenuPress={() => setDrawerOpen(true)} />
            <PocketPill />
            <QuickActionGrid />
            <LoanCards />
            <ContributionsSection />
          </VStack>
        </ScrollView>
      </SafeAreaView>
      <HomeDrawer open={drawerOpen} session={session} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

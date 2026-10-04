import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { BalanceHeader } from '@/components/features/invest/BalanceHeader';
import { PocketPill } from '@/components/features/invest/PocketPill';
import { QuickActionGrid } from '@/components/features/invest/QuickActionGrid';
import { LoanCards } from '@/components/features/invest/LoanCards';
import { ContributionsSection } from '@/components/features/invest/ContributionsSection';
import { heroGradientStops } from '@/constants/theme';
import { useThemeMode } from '@/hooks/useThemeMode';

/** Post-onboarding landing. Co-operative dashboard, blue-skinned. */
export default function InvestScreen() {
  const { mode } = useThemeMode();

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={heroGradientStops(mode)}
        locations={[0, 0.45, 0.75, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 400 }}
      />
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-0 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <BalanceHeader />
        <PocketPill />
        <VStack className="mt-4 gap-4 rounded-t-[28px] bg-background px-5 pb-2 pt-5">
          <QuickActionGrid />
          <LoanCards />
          <ContributionsSection />
        </VStack>
      </ScrollView>
    </View>
  );
}

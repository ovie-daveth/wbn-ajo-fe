import { Tabs } from 'expo-router';
import { InvestTabBar } from '@/components/common/InvestTabBar';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="invest"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <InvestTabBar {...props} />}
    >
      {/* Post-onboarding landing. Hidden from the bar (exactly 3 visible tabs). */}
      <Tabs.Screen name="invest" options={{ href: null, title: 'Invest' }} />
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="analysis" options={{ title: 'Analysis' }} />
      <Tabs.Screen name="wallet" options={{ title: 'Wallet' }} />
    </Tabs>
  );
}

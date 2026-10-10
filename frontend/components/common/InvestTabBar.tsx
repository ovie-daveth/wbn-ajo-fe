import { Pressable, View } from 'react-native';
import { House, ChartPie, Wallet } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

type TabState = {
  index: number;
  routes: { key: string; name: string }[];
};

type InvestTabBarProps = {
  state: TabState;
  navigation: { navigate: (name: string) => void };
};

const VISIBLE_TABS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: 'home', label: 'Home', icon: House },
  { name: 'analysis', label: 'Analysis', icon: ChartPie },
  { name: 'wallet', label: 'Wallet', icon: Wallet },
];

/**
 * Floating black pill bar on the layout background. Active tab = white
 * capsule with icon + label, inactive tabs = dimmed bare icons. The strip
 * behind the pill uses the screen background so it blends in; safe-area
 * padding keeps it clear of the system navigation.
 */
export function InvestTabBar({ state, navigation }: InvestTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name;

  return (
    <View
      style={{
        paddingBottom: Math.max(insets.bottom, 12) + 10,
        paddingHorizontal: 32,
      }}
      className="items-center bg-background"
      pointerEvents="box-none"
    >
      <HStack className="items-center justify-between gap-1 rounded-full bg-black px-2 py-2 shadow-soft-1">
        {VISIBLE_TABS.map((tab) => {
          const active = tab.name === activeName;
          if (active) {
            return (
              <Pressable
                key={tab.name}
                onPress={() => navigation.navigate(tab.name)}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: true }}
                hitSlop={6}
                android_ripple={{ color: 'rgba(10,15,30,0.2)', borderless: true, radius: 24 }}
                style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
                className="flex-row items-center gap-1.5 rounded-full bg-white px-4 py-2.5"
              >
                <tab.icon size={20} color="#0A0F1E" fill="#0A0F1E" />
                <Text style={{ color: '#0A0F1E' }} className="text-sm font-bold">
                  {tab.label}
                </Text>
              </Pressable>
            );
          }
          return (
            <Pressable
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: false }}
              hitSlop={6}
              android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              className="h-11 w-11 items-center justify-center rounded-full"
            >
              <tab.icon size={22} color="rgba(255,255,255,0.55)" />
            </Pressable>
          );
        })}
      </HStack>
    </View>
  );
}

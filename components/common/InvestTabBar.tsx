import { Pressable, View } from 'react-native';
import { House, ChartPie, Wallet } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { useThemeMode } from '@/hooks/useThemeMode';

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
 * Floating bottom-center pill bar. Exactly 3 tabs; the hidden `invest` route
 * (landing after onboarding) intentionally highlights none.
 */
export function InvestTabBar({ state, navigation }: InvestTabBarProps) {
  const { isDark } = useThemeMode();
  const activeName = state.routes[state.index]?.name;
  const pillClass = isDark ? 'bg-white' : 'bg-typography-black';
  const pillIconColor = isDark ? '#0A0F1E' : '#FFFFFF';

  return (
    <View className="items-center pb-7">
      <HStack className="items-center gap-1 rounded-full border border-border bg-secondary p-1.5 shadow-soft-1">
        {VISIBLE_TABS.map((tab) => {
          const active = tab.name === activeName;
          return (
            <Pressable
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }}
              hitSlop={6}
              className={active ? `h-12 w-12 items-center justify-center rounded-full ${pillClass}` : 'h-12 w-12 items-center justify-center rounded-full'}
            >
              {active ? (
                <tab.icon size={22} color={pillIconColor} />
              ) : (
                <ThemedIcon icon={tab.icon} size={22} />
              )}
            </Pressable>
          );
        })}
      </HStack>
    </View>
  );
}

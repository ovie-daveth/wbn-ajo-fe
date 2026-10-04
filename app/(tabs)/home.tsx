import { House } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/common/EmptyState';

/** Designed later — intentional placeholder reusing the shared empty state. */
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <EmptyState
          icon={House}
          title="Home is on its way"
          body="We're designing the home experience now. Your Invest dashboard is ready below."
        />
      </View>
    </SafeAreaView>
  );
}

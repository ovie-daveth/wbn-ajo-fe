import { ChartPie } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/common/EmptyState';

export default function AnalysisScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <EmptyState
          icon={ChartPie}
          title="Analysis is on its way"
          body="Spending breakdowns and insights will live here."
        />
      </View>
    </SafeAreaView>
  );
}

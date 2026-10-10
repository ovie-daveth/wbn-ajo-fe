import { Wallet } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/common/EmptyState';

export default function WalletScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <EmptyState
          icon={Wallet}
          title="Wallet is on its way"
          body="Cards and accounts you link will appear here."
        />
      </View>
    </SafeAreaView>
  );
}

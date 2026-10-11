import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowDownToLine, BadgeCheck, ChevronLeft, Landmark } from 'lucide-react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { formatMoney } from '@/utils/format';
import {
  ledgerBalance,
  loadLedger,
  loadWithdrawAccount,
  recordLedgerEntry,
  type WithdrawAccount,
} from '@/utils/wallet';

/**
 * Withdraw screen. Reached through the KYC gate from wallet.
 * Demo stub: records locally until the payouts backend lands —
 * swap the record step for POST /withdrawals.
 */
export default function WithdrawScreen() {
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState<WithdrawAccount | null>(null);
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadLedger().then((records) => setBalance(ledgerBalance(records)));
      loadWithdrawAccount().then(setAccount);
    }, []),
  );

  const amount = Number(raw.replace(/\D/g, '')) || 0;

  const confirm = async () => {
    if (!account) {
      setError('Connect a withdrawal account first.');
      return;
    }
    if (!Number.isFinite(amount) || amount < 100) {
      setError('Enter at least ₦100 to withdraw.');
      return;
    }
    if (amount > balance) {
      setError('That is more than your balance.');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      // Demo ledger — TODO: replace with POST /withdrawals.
      await recordLedgerEntry({ kind: 'withdrawal', amount, frequency: '', method: 'Bank Transfer' });
      await new Promise<void>((resolve) => setTimeout(resolve, 1200)); // simulate processing
      setDone(amount);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="auto" />
      <SafeAreaView className="flex-1" edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <HStack className="items-center gap-3 px-5 pt-1">
            <Pressable
              onPress={() => router.back()}
              accessibilityLabel="Back"
              hitSlop={12}
              className="rounded-full bg-secondary p-1.5 active:opacity-70"
            >
              <ThemedIcon icon={ChevronLeft} size={22} />
            </Pressable>
            <Heading className="text-lg font-bold">Withdraw</Heading>
          </HStack>

          {done !== null ? (
            <VStack className="flex-1 items-center justify-center gap-3 px-8">
              <Animated.View entering={ZoomIn.springify()}>
                <View className="rounded-full bg-emerald-500 p-5">
                  <BadgeCheck size={40} color="#fff" />
                </View>
              </Animated.View>
              <Heading className="text-center text-[24px] font-extrabold">
                {formatMoney(done)} on its way
              </Heading>
              <Text className="text-center text-[14px] leading-6 text-typography-gray">
                Heading to {account?.bankName} ···· {account?.accountNumber.slice(-4)}. It usually
                lands within minutes.
              </Text>
            </VStack>
          ) : (
            <ScrollView
              className="flex-1"
              contentContainerClassName="grow"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <VStack className="gap-4 px-6 pb-4 pt-4">
                <AppCard className="gap-1 p-5">
                  <Text className="text-xs font-medium text-typography-gray">
                    Available balance
                  </Text>
                  <Text className="text-3xl font-extrabold tracking-tight">
                    {formatMoney(balance)}
                  </Text>
                </AppCard>

                <VStack className="gap-1.5">
                  <HStack className="items-center justify-between">
                    <Text className="text-sm font-medium">Amount</Text>
                    <Pressable
                      onPress={() => {
                        setRaw(String(Math.floor(balance)));
                        setError(null);
                      }}
                      hitSlop={8}
                    >
                      <Text className="text-sm font-semibold text-primary">Use max</Text>
                    </Pressable>
                  </HStack>
                  <Input>
                    <InputField
                      placeholder="₦0"
                      value={raw}
                      onChangeText={(v) => {
                        setRaw(v.replace(/\D/g, '').slice(0, 9));
                        setError(null);
                      }}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      onSubmitEditing={confirm}
                    />
                  </Input>
                </VStack>

                <VStack className="gap-1.5">
                  <Text className="text-sm font-medium">To</Text>
                  {account ? (
                    <AppCard className="p-4">
                      <HStack className="items-center gap-3">
                        <View className="rounded-full bg-secondary p-2.5">
                          <ThemedIcon icon={Landmark} size={20} />
                        </View>
                        <VStack className="flex-1 gap-0">
                          <Text className="text-[15px] font-bold">{account.bankName}</Text>
                          <Text className="text-xs text-typography-gray">
                            ···· {account.accountNumber.slice(-4)} · {account.holderName}
                          </Text>
                        </VStack>
                        <ArrowDownToLine size={18} color="#10B981" />
                      </HStack>
                    </AppCard>
                  ) : (
                    <AppCard className="gap-2 p-4">
                      <Text className="text-sm leading-6 text-typography-gray">
                        No withdrawal account connected yet. Go back to your wallet and tap
                        Connect — it takes less than a minute.
                      </Text>
                      <AppButton title="Back to wallet" onPress={() => router.back()} variant="outline" />
                    </AppCard>
                  )}
                </VStack>

                {error && <Text className="text-sm text-destructive">{error}</Text>}
              </VStack>
            </ScrollView>
          )}

          <View style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }} className="px-6">
            {done !== null ? (
              <AppButton title="Done" onPress={() => router.back()} variant="dark" />
            ) : (
              <AppButton
                title={`Withdraw ${formatMoney(amount || 0)}`}
                onPress={confirm}
                loading={busy}
                variant="dark"
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

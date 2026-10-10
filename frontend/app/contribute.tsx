import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { rates } from '@/constants/rates';
import { formatMoney, formatWholeNaira } from '@/utils/format';
import { loadSession } from '@/utils/session';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BadgeCheck, ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';

type Frequency = 'Weekly' | 'Monthly';

const RECORDS_KEY = 'wbn-invest-contributions';

function tierFor(freq: Frequency): number {
  return freq === 'Weekly' ? rates.weeklyContribution : rates.monthlyContribution;
}

/**
 * Contribute screen. Reached only through the KYC gate on home.
 * Demo stub: records the contribution locally (SecureStore list) until the
 * payments backend lands — swap `recordContribution` for POST /contributions.
 */
export default function ContributeScreen() {
  const insets = useSafeAreaInsets();
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [custom, setCustom] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ amount: number; frequency: Frequency } | null>(null);

  useEffect(() => {
    loadSession().then((s) => {
      if (s?.email) setEmail(s.email);
    });
  }, []);

  useEffect(() => {
    // Changing frequency resets the amount choice to that tier.
    setSelected(tierFor(frequency));
    setCustom('');
    setError(null);
  }, [frequency]);

  const amount = custom.trim() !== '' ? Number(custom.replace(/\D/g, '')) : (selected ?? 0);

  const confirm = async () => {
    if (!Number.isFinite(amount) || amount < 100) {
      setError('Enter at least ₦100 to contribute.');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      // Demo ledger — TODO: replace with POST /contributions.
      const raw = await SecureStore.getItemAsync(RECORDS_KEY);
      const list = raw ? (JSON.parse(raw) as unknown[]) : [];
      list.push({ amount, frequency, at: new Date().toISOString() });
      await SecureStore.setItemAsync(RECORDS_KEY, JSON.stringify(list));
      await new Promise<void>((resolve) => setTimeout(resolve, 1200)); // simulate processing
      setDone({ amount, frequency });
    } finally {
      setBusy(false);
    }
  };

  const presets = [1, 2, 4].map((m) => tierFor(frequency) * m);

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
            <Heading className="text-lg font-bold">Contribute</Heading>
          </HStack>

          {done ? (
            <VStack className="flex-1 items-center justify-center gap-3 px-8">
              <Animated.View entering={ZoomIn.springify()}>
                <View className="rounded-full bg-emerald-500 p-5">
                  <BadgeCheck size={40} color="#fff" />
                </View>
              </Animated.View>
              <Heading className="text-center text-[24px] font-extrabold">
                {formatMoney(done.amount)} received
              </Heading>
              <Text className="text-center text-[14px] leading-6 text-typography-gray">
                {done.frequency} contribution recorded. Membership stays active — and your loan
                eligibility keeps growing.
              </Text>
              {email !== '' && (
                <Text className="text-center text-xs text-typography-gray">
                  Receipt sent to {email}
                </Text>
              )}
            </VStack>
          ) : (
            <ScrollView
              className="flex-1"
              contentContainerClassName="grow"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <VStack className="gap-4 px-6 pb-4 pt-4">
                <VStack className="gap-1.5">
                  <Text className="text-sm font-medium">How often?</Text>
                  <HStack className="gap-2">
                    {(['Weekly', 'Monthly'] as Frequency[]).map((f) => {
                      const activeFreq = frequency === f;
                      return (
                        <Pressable
                          key={f}
                          onPress={() => setFrequency(f)}
                          android_ripple={{ color: 'rgba(47,103,246,0.2)', borderless: false }}
                          className={
                            activeFreq
                              ? 'flex-1 items-center rounded-2xl bg-primary px-4 py-3.5'
                              : 'flex-1 items-center rounded-2xl border border-border px-4 py-3.5'
                          }
                        >
                          <Text
                            className={
                              activeFreq
                                ? 'text-sm font-bold text-white'
                                : 'text-sm font-semibold'
                            }
                          >
                            {f}
                          </Text>
                          <Text
                            className={
                              activeFreq ? 'text-xs text-white/80' : 'text-xs text-typography-gray'
                            }
                          >
                            {formatWholeNaira(tierFor(f))} tier
                          </Text>
                        </Pressable>
                      );
                    })}
                  </HStack>
                </VStack>

                <VStack className="gap-1.5">
                  <Text className="text-sm font-medium">Amount</Text>
                  <HStack className="gap-2">
                    {presets.map((p) => {
                      const activeAmt = custom.trim() === '' && selected === p;
                      return (
                        <Pressable
                          key={p}
                          onPress={() => {
                            setSelected(p);
                            setCustom('');
                            setError(null);
                          }}
                          className={
                            activeAmt
                              ? 'flex-1 items-center rounded-2xl bg-typography-black px-2 py-3 dark:bg-white'
                              : 'flex-1 items-center rounded-2xl border border-border px-2 py-3'
                          }
                        >
                          <Text
                            className={
                              activeAmt
                                ? 'text-sm font-bold text-white dark:text-typography-black'
                                : 'text-sm font-semibold'
                            }
                          >
                            {formatWholeNaira(p)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </HStack>
                  <Input>
                    <InputField
                      placeholder="Or type a custom amount"
                      value={custom}
                      onChangeText={(v) => {
                        setCustom(v.replace(/\D/g, '').slice(0, 9));
                        setError(null);
                      }}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      onSubmitEditing={confirm}
                    />
                  </Input>
                </VStack>

                <AppCard className="p-4">
                  <HStack className="items-center justify-between">
                    <VStack className="gap-0.5">
                      <Text className="text-sm font-bold">{frequency} contribution</Text>
                      <Text className="text-xs text-typography-gray">
                        Keeps membership active
                      </Text>
                    </VStack>
                    <Text className="text-xl font-extrabold">{formatMoney(amount || 0)}</Text>
                  </HStack>
                </AppCard>

                {error && <Text className="text-sm text-destructive">{error}</Text>}
              </VStack>
            </ScrollView>
          )}

          <View style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }} className="px-6">
            {done ? (
              <AppButton title="Done" onPress={() => router.back()} variant="dark" />
            ) : (
              <AppButton
                title={`Contribute ${formatMoney(amount || 0)}`}
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

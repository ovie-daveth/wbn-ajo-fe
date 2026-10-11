import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { demoReceivingAccount } from '@/constants/payments';
import { rates } from '@/constants/rates';
import { formatMoney, formatWholeNaira } from '@/utils/format';
import { loadSession } from '@/utils/session';
import { setStringAsync as copyToClipboard } from 'expo-clipboard';
import { addCard, detectCardBrand, recordLedgerEntry } from '@/utils/wallet';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  BadgeCheck,
  Check,
  Copy,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
  ChevronLeft,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

type Frequency = 'Weekly' | 'Monthly';
type Stage = 'amount' | 'pay' | 'done';
type MethodKey = 'transfer' | 'card' | 'opay' | 'paystack';

const METHODS: { key: MethodKey; label: string; sub: string; icon: LucideIcon }[] = [
  { key: 'transfer', label: 'Bank Transfer', sub: 'Free · arrives in minutes', icon: Landmark },
  { key: 'card', label: 'Debit Card', sub: 'Instant · Mastercard, Visa, Verve', icon: CreditCard },
  { key: 'opay', label: 'OPay', sub: 'Pay with your OPay wallet', icon: Smartphone },
  { key: 'paystack', label: 'Paystack', sub: 'Cards, transfer & more', icon: Wallet },
];

function tierFor(freq: Frequency): number {
  return freq === 'Weekly' ? rates.weeklyContribution : rates.monthlyContribution;
}

function luhnOk(digits: string): boolean {
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return digits.length > 0 && sum % 10 === 0;
}

function expiryOk(raw: string): boolean {
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(raw);
  if (!m) return false;
  const now = new Date();
  const yy = now.getFullYear() % 100;
  const mm = now.getMonth() + 1;
  return Number(m[2]) > yy || (Number(m[2]) === yy && Number(m[1]) >= mm);
}

const formatCardDisplay = (digits: string) =>
  digits
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiryInput = (digits: string) => {
  const d = digits.slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/**
 * Contribute screen. Reached only through the KYC gate on home.
 * Amount → payment method (transfer / card / OPay / Paystack) → receipt.
 * Demo stub: records locally (SecureStore list) until the payments backend
 * lands — swap the record step for POST /contributions + provider redirects.
 */
export default function ContributeScreen() {
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<Stage>('amount');
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [custom, setCustom] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [method, setMethod] = useState<MethodKey>('transfer');
  const [cardDigits, setCardDigits] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ amount: number; frequency: Frequency; method: string } | null>(null);

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
  const methodLabel = METHODS.find((m) => m.key === method)?.label ?? '';

  const goBack = () => {
    if (stage === 'pay') {
      setError(null);
      setStage('amount');
      return;
    }
    router.back();
  };

  const goToPayment = () => {
    if (!Number.isFinite(amount) || amount < 100) {
      setError('Enter at least ₦100 to contribute.');
      return;
    }
    setError(null);
    setStage('pay');
  };

  const recordAndFinish = async (methodUsed: string) => {
    setBusy(true);
    try {
      // Demo ledger — TODO: replace with POST /contributions.
      await recordLedgerEntry({ kind: 'contribution', amount, frequency, method: methodUsed });
      await new Promise<void>((resolve) => setTimeout(resolve, 1200)); // simulate processing
      setDone({ amount, frequency, method: methodUsed });
      setStage('done');
    } finally {
      setBusy(false);
    }
  };

  const payWithTransfer = () => recordAndFinish('Bank Transfer');

  const payWithCard = () => {
    if (cardDigits.length !== 16 || !luhnOk(cardDigits)) {
      setError('That card number does not look right.');
      return;
    }
    if (!expiryOk(expiry)) {
      setError('Use a valid future expiry as MM/YY.');
      return;
    }
    if (cvv.length < 3) {
      setError('Enter the 3-digit CVV on the back of your card.');
      return;
    }
    if (cardName.trim().length < 2) {
      setError('Enter the name on the card.');
      return;
    }
    setError(null);
    // TODO: swap for Paystack/OPay card-charge call.
    recordAndFinish('Debit Card').then(() => {
      // Persist brand + last4 only — never the PAN or CVV.
      if (saveCard) {
        addCard({
          brand: detectCardBrand(cardDigits),
          last4: cardDigits.slice(-4),
          expiry,
          holder: cardName.trim(),
        }).catch(() => {});
      }
    });
  };

  const payWithWallet = (label: string) => {
    setError(null);
    // TODO: redirect to the provider checkout, verify webhook, then record.
    recordAndFinish(label);
  };

  const copyField = async (key: string, value: string) => {
    await copyToClipboard(value);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
  };

  const presets = [1, 2, 4].map((m) => tierFor(frequency) * m);

  const bottomPadding = { paddingBottom: Math.max(insets.bottom, 16) + 8 };

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
              onPress={goBack}
              accessibilityLabel="Back"
              hitSlop={12}
              className="rounded-full bg-secondary p-1.5 active:opacity-70"
            >
              <ThemedIcon icon={ChevronLeft} size={22} />
            </Pressable>
            <Heading className="text-lg font-bold">
              {stage === 'pay' ? `Pay ${formatMoney(amount || 0)}` : 'Contribute'}
            </Heading>
          </HStack>

          {stage === 'done' && done ? (
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
                {done.frequency} contribution via {done.method}. Membership stays active — and your
                loan eligibility keeps growing.
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
              {stage === 'amount' && (
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
                        onSubmitEditing={goToPayment}
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
              )}

              {stage === 'pay' && (
                <VStack className="gap-4 px-6 pb-4 pt-4">
                  <VStack className="gap-2">
                    {METHODS.map((m) => {
                      const activeMethod = method === m.key;
                      return (
                        <Pressable
                          key={m.key}
                          onPress={() => {
                            setMethod(m.key);
                            setError(null);
                          }}
                          android_ripple={{ color: 'rgba(47,103,246,0.15)', borderless: false }}
                          accessibilityRole="radio"
                          accessibilityState={{ selected: activeMethod }}
                          accessibilityLabel={m.label}
                          className={
                            activeMethod
                              ? 'flex-row items-center gap-3 rounded-2xl border-2 border-primary bg-primary/5 p-4'
                              : 'flex-row items-center gap-3 rounded-2xl border border-border p-4'
                          }
                        >
                          <View
                            className={
                              activeMethod
                                ? 'rounded-full bg-primary p-2.5'
                                : 'rounded-full bg-secondary p-2.5'
                            }
                          >
                            {activeMethod ? (
                              <m.icon size={20} color="#fff" />
                            ) : (
                              <ThemedIcon icon={m.icon} size={20} />
                            )}
                          </View>
                          <VStack className="flex-1 gap-0">
                            <Text className="text-[15px] font-bold">{m.label}</Text>
                            <Text className="text-xs text-typography-gray">{m.sub}</Text>
                          </VStack>
                          <View
                            className={
                              activeMethod
                                ? 'h-5 w-5 items-center justify-center rounded-full bg-primary'
                                : 'h-5 w-5 rounded-full border-2 border-border'
                            }
                          >
                            {activeMethod && <Check size={12} color="#fff" />}
                          </View>
                        </Pressable>
                      );
                    })}
                  </VStack>

                  {method === 'transfer' && (
                    <Animated.View entering={FadeInUp.duration(300)}>
                      <AppCard className="gap-3 p-4">
                        <Text className="text-sm text-typography-gray">
                          Transfer exactly{' '}
                          <Text className="font-extrabold text-foreground">
                            {formatMoney(amount)}
                          </Text>{' '}
                          to:
                        </Text>
                        {(
                          [
                            { key: 'bank', label: 'Bank', value: demoReceivingAccount.bankName },
                            { key: 'acct', label: 'Account number', value: demoReceivingAccount.accountNumber, mono: true },
                            { key: 'name', label: 'Account name', value: demoReceivingAccount.accountName },
                          ] as { key: string; label: string; value: string; mono?: boolean }[]
                        ).map((row) => (
                          <HStack key={row.key} className="items-center justify-between gap-3">
                            <VStack className="flex-1 gap-0">
                              <Text className="text-xs text-typography-gray">{row.label}</Text>
                              <Text
                                className={
                                  row.mono
                                    ? 'text-lg font-extrabold tracking-widest'
                                    : 'text-[15px] font-bold'
                                }
                              >
                                {row.value}
                              </Text>
                            </VStack>
                            <Pressable
                              onPress={() => copyField(row.key, row.value)}
                              hitSlop={8}
                              accessibilityLabel={`Copy ${row.label}`}
                              className="rounded-full bg-secondary p-2.5 active:opacity-70"
                            >
                              {copied === row.key ? (
                                <Check size={16} color="#10B981" />
                              ) : (
                                <ThemedIcon icon={Copy} size={16} />
                              )}
                            </Pressable>
                          </HStack>
                        ))}
                        <Text className="text-xs leading-5 text-typography-gray">
                          Use your full name as the narration so we match it instantly. Demo
                          account — live per-member accounts arrive with the payments backend.
                        </Text>
                      </AppCard>
                    </Animated.View>
                  )}

                  {method === 'card' && (
                    <Animated.View entering={FadeInUp.duration(300)}>
                      <VStack className="gap-3">
                        <VStack className="gap-1.5">
                          <Text className="text-sm font-medium">Card number</Text>
                          <Input>
                            <InputField
                              placeholder="1234 5678 9012 3456"
                              value={formatCardDisplay(cardDigits)}
                              onChangeText={(v) => {
                                setCardDigits(v.replace(/\D/g, '').slice(0, 16));
                                setError(null);
                              }}
                              keyboardType="number-pad"
                              maxLength={19}
                              returnKeyType="next"
                            />
                          </Input>
                        </VStack>
                        <HStack className="gap-3">
                          <VStack className="flex-1 gap-1.5">
                            <Text className="text-sm font-medium">Expiry</Text>
                            <Input>
                              <InputField
                                placeholder="MM/YY"
                                value={expiry}
                                onChangeText={(v) => {
                                  setExpiry(formatExpiryInput(v.replace(/\D/g, '')));
                                  setError(null);
                                }}
                                keyboardType="number-pad"
                                maxLength={5}
                                returnKeyType="next"
                              />
                            </Input>
                          </VStack>
                          <VStack className="flex-1 gap-1.5">
                            <Text className="text-sm font-medium">CVV</Text>
                            <Input>
                              <InputField
                                placeholder="123"
                                value={cvv}
                                onChangeText={(v) => {
                                  setCvv(v.replace(/\D/g, '').slice(0, 4));
                                  setError(null);
                                }}
                                keyboardType="number-pad"
                                maxLength={4}
                                returnKeyType="next"
                              />
                            </Input>
                          </VStack>
                        </HStack>
                        <VStack className="gap-1.5">
                          <Text className="text-sm font-medium">Name on card</Text>
                          <Input>
                            <InputField
                              placeholder="Adaeze Okafor"
                              value={cardName}
                              onChangeText={(v) => {
                                setCardName(v);
                                setError(null);
                              }}
                              autoCapitalize="words"
                              returnKeyType="done"
                              onSubmitEditing={payWithCard}
                            />
                          </Input>
                        </VStack>
                        <Pressable
                          onPress={() => setSaveCard((s) => !s)}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: saveCard }}
                          accessibilityLabel="Save this card"
                          className="flex-row items-center gap-2.5 py-1"
                        >
                          <View
                            className={
                              saveCard
                                ? 'h-5 w-5 items-center justify-center rounded-md bg-primary'
                                : 'h-5 w-5 rounded-md border-2 border-border'
                            }
                          >
                            {saveCard && <Check size={13} color="#fff" />}
                          </View>
                          <Text className="text-sm">Save this card for next time</Text>
                        </Pressable>
                      </VStack>
                    </Animated.View>
                  )}

                  {(method === 'opay' || method === 'paystack') && (
                    <Animated.View entering={FadeInUp.duration(300)}>
                      <AppCard className="gap-1.5 p-4">
                        <Text className="text-sm font-bold">Continue with {methodLabel}</Text>
                        <Text className="text-[13px] leading-5 text-typography-gray">
                          You will approve {formatMoney(amount)} inside {methodLabel}. Demo for
                          now — the real redirect lands with the provider keys.
                        </Text>
                      </AppCard>
                    </Animated.View>
                  )}

                  {error && <Text className="text-sm text-destructive">{error}</Text>}
                </VStack>
              )}
            </ScrollView>
          )}

          <View style={bottomPadding} className="px-6">
            {stage === 'done' ? (
              <AppButton title="Done" onPress={() => router.back()} variant="dark" />
            ) : stage === 'amount' ? (
              <AppButton
                title={`Continue to payment · ${formatMoney(amount || 0)}`}
                onPress={goToPayment}
                variant="dark"
              />
            ) : method === 'transfer' ? (
              <AppButton
                title="I've sent the money"
                onPress={payWithTransfer}
                loading={busy}
                variant="dark"
              />
            ) : method === 'card' ? (
              <AppButton
                title={`Pay ${formatMoney(amount)}`}
                onPress={payWithCard}
                loading={busy}
                variant="dark"
              />
            ) : (
              <AppButton
                title={`Continue with ${methodLabel}`}
                onPress={() => payWithWallet(methodLabel)}
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

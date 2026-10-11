import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { BottomSheetModal } from '@/components/common/BottomSheetModal';
import { EmptyState } from '@/components/common/EmptyState';
import { MoneyText } from '@/components/common/MoneyText';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { KycGateModal } from '@/components/features/kyc/KycGateModal';
import { useKycGate } from '@/components/features/kyc/useKycGate';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { demoReceivingAccount } from '@/constants/payments';
import { formatMoney } from '@/utils/format';
import {
  ledgerBalance,
  loadCards,
  loadLedger,
  loadWithdrawAccount,
  removeCard,
  saveWithdrawAccount,
  setPreferredCard,
  type LedgerRecord,
  type SavedCard,
  type WithdrawAccount,
} from '@/utils/wallet';
import { setStringAsync as copyToClipboard } from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import {
  ArrowDownToLine,
  CreditCard,
  Landmark,
  Pencil,
  Plus,
  Receipt,
  Smartphone,
  Star,
  Trash2,
  Wallet as WalletIcon,
  type LucideIcon
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function methodIcon(method: string): LucideIcon {
  if (method === 'Bank Transfer') return Landmark;
  if (method === 'Debit Card') return CreditCard;
  if (method === 'OPay') return Smartphone;
  if (method === 'Paystack') return WalletIcon;
  return Receipt;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function maskedAccount(number: string): string {
  const digits = number.replace(/\D/g, '');
  return digits.length > 4 ? `···· ${digits.slice(-4)}` : number;
}

/**
 * Member wallet: live balance, preferred contribution methods (saved cards),
 * the connected withdrawal account, the receiving (transfer) account, and
 * recent activity. Funding and payouts go through the KYC gate.
 */
export default function WalletScreen() {
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [account, setAccount] = useState<WithdrawAccount | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [accountModal, setAccountModal] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [accountError, setAccountError] = useState<string | null>(null);
  const { gateOpen, closeGate, requestContribute, requestWithdraw, finishKyc } = useKycGate();

  const refresh = useCallback(() => {
    loadLedger().then(setRecords);
    loadCards().then(setCards);
    loadWithdrawAccount().then(setAccount);
  }, []);

  useFocusEffect(refresh);

  const balance = ledgerBalance(records);
  const preferred = cards.find((c) => c.preferred) ?? cards[0];

  const copyField = async (key: string, value: string) => {
    await copyToClipboard(value);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
  };

  const openAccountModal = () => {
    setBankName(account?.bankName ?? '');
    setAccountNumber(account?.accountNumber ?? '');
    setHolderName(account?.holderName ?? '');
    setAccountError(null);
    setAccountModal(true);
  };

  const saveAccount = async () => {
    if (bankName.trim().length < 2) {
      setAccountError('Enter your bank name.');
      return;
    }
    if (accountNumber.replace(/\D/g, '').length !== 10) {
      setAccountError('Account numbers are exactly 10 digits (NUBAN).');
      return;
    }
    if (holderName.trim().length < 2) {
      setAccountError('Enter the account holder name.');
      return;
    }
    const next = {
      bankName: bankName.trim(),
      accountNumber: accountNumber.replace(/\D/g, ''),
      holderName: holderName.trim(),
    };
    await saveWithdrawAccount(next);
    setAccount(next);
    setAccountModal(false);
  };

  const receivingRows = [
    { key: 'bank', label: 'Bank', value: demoReceivingAccount.bankName },
    { key: 'acct', label: 'Account number', value: demoReceivingAccount.accountNumber, mono: true },
    { key: 'name', label: 'Account name', value: demoReceivingAccount.accountName },
  ] as { key: string; label: string; value: string; mono?: boolean }[];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="gap-4 px-5 pb-6 pt-2">
          <Heading className="text-[24px] font-extrabold">Wallet</Heading>

          {/* Balance */}
          <AppCard className="gap-1 p-5">
            <Text className="text-xs font-medium text-typography-gray">Total contributed</Text>
            <MoneyText size="display">{formatMoney(balance)}</MoneyText>
            <Text className="text-xs text-typography-gray">
              {records.length === 0
                ? 'Nothing here yet — your first contribution starts the count.'
                : `Across ${records.length} transaction${records.length === 1 ? '' : 's'}`}
            </Text>
          </AppCard>

          <HStack className="gap-2">
            <View className="flex-1">
              <AppButton title="Contribute" onPress={requestContribute} variant="dark" />
            </View>
            <View className="flex-1">
              <AppButton title="Withdraw" onPress={requestWithdraw} variant="outline" />
            </View>
          </HStack>

          {/* Preferred contribution methods */}
          <VStack className="gap-2">
            <Text className="text-base font-bold">Payment methods</Text>
            {cards.length === 0 ? (
              <AppCard className="p-4">
                <Text className="text-sm leading-6 text-typography-gray">
                  No card saved yet. Pay with a card once and tick “Save this card” — it will
                  appear here as your preferred way to contribute.
                </Text>
              </AppCard>
            ) : (
              <AppCard className="p-2">
                {cards.map((card) => (
                  <HStack key={card.id} className="items-center gap-3 p-3">
                    <Box className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <ThemedIcon icon={CreditCard} size={18} />
                    </Box>
                    <VStack className="flex-1 gap-0">
                      <HStack className="items-center gap-1.5">
                        <Text className="text-sm font-semibold">
                          {card.brand} ···· {card.last4}
                        </Text>
                        {card.preferred && (
                          <HStack className="items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5">
                            <Star size={10} color="#2F67F6" fill="#2F67F6" />
                            <Text className="text-[10px] font-bold text-primary">Preferred</Text>
                          </HStack>
                        )}
                      </HStack>
                      <Text className="text-[11px] text-typography-gray">
                        Expires {card.expiry} · {card.holder}
                      </Text>
                    </VStack>
                    {!card.preferred && (
                      <Pressable
                        onPress={() => setPreferredCard(card.id).then(setCards)}
                        hitSlop={8}
                        accessibilityLabel={`Make ${card.brand} preferred`}
                        className="rounded-full bg-secondary p-2 active:opacity-70"
                      >
                        <ThemedIcon icon={Star} size={15} />
                      </Pressable>
                    )}
                    <Pressable
                      onPress={() => removeCard(card.id).then(setCards)}
                      hitSlop={8}
                      accessibilityLabel={`Remove ${card.brand} card`}
                      className="rounded-full bg-secondary p-2 active:opacity-70"
                    >
                      <ThemedIcon icon={Trash2} size={15} />
                    </Pressable>
                  </HStack>
                ))}
              </AppCard>
            )}
            {preferred && (
              <Text className="text-xs text-typography-gray">
                {preferred.brand} ···· {preferred.last4} is your preferred way to contribute.
              </Text>
            )}
          </VStack>

          {/* Withdrawal account */}
          <VStack className="gap-2">
            <HStack className="items-center justify-between">
              <Text className="text-base font-bold">Withdrawal account</Text>
              <Pressable onPress={openAccountModal} hitSlop={8} accessibilityLabel={account ? 'Edit withdrawal account' : 'Connect withdrawal account'}>
                <HStack className="items-center gap-1">
                  <ThemedIcon icon={account ? Pencil : Plus} size={14} />
                  <Text className="text-sm font-semibold text-primary">
                    {account ? 'Edit' : 'Connect'}
                  </Text>
                </HStack>
              </Pressable>
            </HStack>
            {account ? (
              <AppCard className="p-4">
                <HStack className="items-center gap-3">
                  <Box className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <ThemedIcon icon={Landmark} size={18} />
                  </Box>
                  <VStack className="flex-1 gap-0">
                    <Text className="text-sm font-semibold">{account.bankName}</Text>
                    <Text className="text-[11px] text-typography-gray">
                      {maskedAccount(account.accountNumber)} · {account.holderName}
                    </Text>
                  </VStack>
                  <ArrowDownToLine size={18} color="#10B981" />
                </HStack>
              </AppCard>
            ) : (
              <AppCard className="p-4">
                <Text className="text-sm leading-6 text-typography-gray">
                  Connect the bank account your withdrawals land in. It takes less than a minute.
                </Text>
              </AppCard>
            )}
          </VStack>
          {/* Activity */}
          <VStack className="gap-2">
            <Text className="text-base font-bold">Recent activity</Text>
            {records.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="No activity yet"
                body="Contributions you make will appear here with receipts."
                actionLabel="Make a contribution"
                onAction={requestContribute}
              />
            ) : (
              <AppCard className="p-2">
                {records.slice(0, 10).map((r, i) => {
                  const Icon = r.kind === 'withdrawal' ? ArrowDownToLine : methodIcon(r.method);
                  const title =
                    r.kind === 'withdrawal'
                      ? 'Withdrawal'
                      : r.frequency
                        ? `${r.frequency} contribution`
                        : 'Contribution';
                  return (
                    <HStack key={`${r.at}-${i}`} className="items-center gap-3 p-3">
                      <Box className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <ThemedIcon icon={Icon} size={18} />
                      </Box>
                      <VStack className="flex-1 gap-0">
                        <Text className="text-sm font-semibold">{title}</Text>
                        <Text className="text-[11px] text-typography-gray">
                          {[r.method, formatDate(r.at)].filter(Boolean).join(' · ')}
                        </Text>
                      </VStack>
                      <Text
                        className={
                          r.kind === 'withdrawal'
                            ? 'text-sm font-bold text-destructive'
                            : 'text-sm font-bold'
                        }
                      >
                        {r.kind === 'withdrawal' ? '−' : '+'}
                        {formatMoney(r.amount)}
                      </Text>
                    </HStack>
                  );
                })}
              </AppCard>
            )}
          </VStack>
        </VStack>
      </ScrollView>

      {/* Withdrawal account form */}
      <BottomSheetModal visible={accountModal} onRequestClose={() => setAccountModal(false)} onBackdropPress={() => setAccountModal(false)}>
        <VStack className="gap-4">
          <Heading className="text-center text-[22px] font-extrabold">
            {account ? 'Update withdrawal account' : 'Connect withdrawal account'}
          </Heading>
          <Text className="text-center text-[14px] leading-6 text-typography-gray">
            Withdrawals land here. Double-check the digits — we send exactly where you point us.
          </Text>
          <VStack className="gap-3">
            <VStack className="gap-1.5">
              <Text className="text-sm font-medium">Bank name</Text>
              <Input>
                <InputField
                  placeholder="Wema Bank"
                  value={bankName}
                  onChangeText={(v) => {
                    setBankName(v);
                    setAccountError(null);
                  }}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </Input>
            </VStack>
            <VStack className="gap-1.5">
              <Text className="text-sm font-medium">Account number</Text>
              <Input>
                <InputField
                  placeholder="0123456789"
                  value={accountNumber}
                  onChangeText={(v) => {
                    setAccountNumber(v.replace(/\D/g, '').slice(0, 10));
                    setAccountError(null);
                  }}
                  keyboardType="number-pad"
                  maxLength={10}
                  returnKeyType="next"
                />
              </Input>
            </VStack>
            <VStack className="gap-1.5">
              <Text className="text-sm font-medium">Account holder name</Text>
              <Input>
                <InputField
                  placeholder="Adaeze Okafor"
                  value={holderName}
                  onChangeText={(v) => {
                    setHolderName(v);
                    setAccountError(null);
                  }}
                  autoCapitalize="words"
                  returnKeyType="done"
                  onSubmitEditing={saveAccount}
                />
              </Input>
            </VStack>
          </VStack>
          {accountError && <Text className="text-sm text-destructive">{accountError}</Text>}
          <AppButton title="Save account" onPress={saveAccount} variant="dark" />
        </VStack>
      </BottomSheetModal>

      <KycGateModal visible={gateOpen} onClose={closeGate} onCompleteKyc={finishKyc} />
    </SafeAreaView>
  );
}

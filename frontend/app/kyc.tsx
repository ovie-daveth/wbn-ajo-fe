import { AppButton } from '@/components/common/AppButton';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  ID_TYPES,
  isValidDob,
  isValidIdNumber,
  loadProfile,
  saveProfile,
  type IdType,
  type MemberProfile,
} from '@/utils/profile';
import { loadSession } from '@/utils/session';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, SlideInRight } from 'react-native-reanimated';

const STEPS = [
  {
    key: 'profile',
    title: 'Tell us who you are',
    body: 'Your real name and phone number. The co-op knows its members by name, not account numbers.',
  },
  {
    key: 'personal',
    title: 'A little more about you',
    body: 'Your birth date proves eligibility, your address is where official notices go.',
  },
  {
    key: 'identity',
    title: 'Prove it with an ID',
    body: 'One government ID unlocks money movement. We only store the number, never a photo.',
  },
  {
    key: 'review',
    title: 'Look it over',
    body: 'Tap any row to fix it. Submitting marks you verified instantly (demo — a real review queue lands with the backend).',
  },
] as const;

const TOTAL = STEPS.length;

function validateStep(
  step: number,
  v: { name: string; phone: string; dob: string; address: string; idType: IdType | ''; idNumber: string },
): string | null {
  switch (step) {
    case 0:
      if (v.name.trim().length < 2) return 'Tell us your full name — at least 2 characters.';
      if (v.phone.replace(/\D/g, '').length < 7) return 'That phone number looks too short.';
      return null;
    case 1:
      if (!isValidDob(v.dob)) return 'Use a real birth date as YYYY-MM-DD. You must be 16 or older.';
      if (v.address.trim().length < 6) return 'Give your full home address.';
      return null;
    case 2:
      if (v.idType === '') return 'Pick which ID you are verifying with.';
      if (!isValidIdNumber(v.idType, v.idNumber)) {
        return v.idType === 'BVN' || v.idType === 'NIN'
          ? `${v.idType} must be exactly 11 digits.`
          : 'That ID number looks too short.';
      }
      return null;
    default:
      return null;
  }
}

/**
 * Profile update + KYC journey. Doubles as first-time verification and
 * later edits — fields prefill from the saved profile (and session).
 * `returnTo` param (e.g. /contribute) decides where submit lands.
 */
export default function KycScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [idType, setIdType] = useState<IdType | ''>('');
  const [idNumber, setIdNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const [profile, session] = await Promise.all([loadProfile(), loadSession()]);
      setName(profile.fullName || session?.name || '');
      setPhone(profile.phone || session?.phone || '');
      setDob(profile.dob);
      setAddress(profile.address);
      setIdType(profile.idType);
      setIdNumber(profile.idNumber);
    })();
  }, []);

  const values = { name, phone, dob, address, idType, idNumber };

  const goNext = () => {
    const problem = validateStep(step, values);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL - 1));
  };

  const goBack = () => {
    if (step === 0) {
      router.back();
      return;
    }
    setError(null);
    setStep((s) => s - 1);
  };

  const submit = async () => {
    for (let s = 0; s < 3; s++) {
      const problem = validateStep(s, values);
      if (problem) {
        setError(problem);
        setStep(s);
        return;
      }
    }
    setError(null);
    setBusy(true);
    try {
      const profile: MemberProfile = {
        fullName: name.trim(),
        phone: phone.trim(),
        dob: dob.trim(),
        address: address.trim(),
        idType,
        idNumber: idNumber.trim(),
        kycStatus: 'verified', // demo: instant verify until backend review lands
        updatedAt: null,
      };
      await saveProfile(profile);
      if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
        router.replace(returnTo as never);
      } else {
        router.back();
      }
    } finally {
      setBusy(false);
    }
  };

  const meta = STEPS[step];
  const reviewRows = [
    { label: 'Full name', value: name.trim(), goto: 0 },
    { label: 'Phone', value: phone.trim(), goto: 0 },
    { label: 'Date of birth', value: dob.trim(), goto: 1 },
    { label: 'Address', value: address.trim(), goto: 1 },
    { label: 'ID', value: idType ? `${idType} · ${idNumber.trim()}` : '', goto: 2 },
  ];

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
            <Heading className="text-lg font-bold">Profile & KYC</Heading>
          </HStack>

          <ScrollView
            className="flex-1"
            contentContainerClassName="grow"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <VStack className="gap-4 px-6 pb-4 pt-4">
              <HStack className="items-center gap-1.5">
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <Animated.View
                    key={`${step}-${i}`}
                    entering={FadeInUp.delay(i * 50).duration(250)}
                    className={
                      i === step
                        ? 'h-1.5 w-7 rounded-full bg-primary'
                        : i < step
                          ? 'h-1.5 w-1.5 rounded-full bg-primary/50'
                          : 'h-1.5 w-1.5 rounded-full bg-border'
                    }
                  />
                ))}
                <Text className="ml-2 text-xs font-semibold text-typography-gray">
                  Step {step + 1} of {TOTAL}
                </Text>
              </HStack>

              <VStack className="gap-1">
                <Heading className="text-[24px] font-extrabold leading-tight">{meta.title}</Heading>
                <Text className="text-[14px] leading-6 text-typography-gray">{meta.body}</Text>
              </VStack>

              <Animated.View key={step} entering={SlideInRight.duration(350)}>
                {step === 0 && (
                  <VStack className="gap-3">
                    <VStack className="gap-1.5">
                      <Text className="text-sm font-medium">Full name</Text>
                      <Input>
                        <InputField
                          placeholder="Adaeze Okafor"
                          value={name}
                          onChangeText={(v) => {
                            setName(v);
                            setError(null);
                          }}
                          autoCapitalize="words"
                          autoComplete="name"
                          returnKeyType="next"
                        />
                      </Input>
                    </VStack>
                    <VStack className="gap-1.5">
                      <Text className="text-sm font-medium">Phone number</Text>
                      <Input>
                        <InputField
                          placeholder="0803 123 4567"
                          value={phone}
                          onChangeText={(v) => {
                            setPhone(v);
                            setError(null);
                          }}
                          keyboardType="phone-pad"
                          autoComplete="tel"
                          returnKeyType="done"
                          onSubmitEditing={goNext}
                        />
                      </Input>
                    </VStack>
                  </VStack>
                )}

                {step === 1 && (
                  <VStack className="gap-3">
                    <VStack className="gap-1.5">
                      <Text className="text-sm font-medium">Date of birth</Text>
                      <Input>
                        <InputField
                          placeholder="YYYY-MM-DD"
                          value={dob}
                          onChangeText={(v) => {
                            setDob(v);
                            setError(null);
                          }}
                          keyboardType="numbers-and-punctuation"
                          returnKeyType="next"
                        />
                      </Input>
                    </VStack>
                    <VStack className="gap-1.5">
                      <Text className="text-sm font-medium">Home address</Text>
                      <Input>
                        <InputField
                          placeholder="12 Allen Avenue, Ikeja, Lagos"
                          value={address}
                          onChangeText={(v) => {
                            setAddress(v);
                            setError(null);
                          }}
                          autoCapitalize="words"
                          returnKeyType="done"
                          onSubmitEditing={goNext}
                        />
                      </Input>
                    </VStack>
                  </VStack>
                )}

                {step === 2 && (
                  <VStack className="gap-3">
                    <VStack className="gap-1.5">
                      <Text className="text-sm font-medium">ID type</Text>
                      <View className="flex-row flex-wrap gap-2">
                        {ID_TYPES.map((t) => {
                          const selected = idType === t;
                          return (
                            <Pressable
                              key={t}
                              onPress={() => {
                                setIdType(t);
                                setError(null);
                              }}
                              android_ripple={{ color: 'rgba(47,103,246,0.2)', borderless: false }}
                              className={
                                selected
                                  ? 'rounded-full bg-primary px-4 py-2.5'
                                  : 'rounded-full border border-border px-4 py-2.5'
                              }
                            >
                              <Text
                                className={
                                  selected
                                    ? 'text-sm font-semibold text-white'
                                    : 'text-sm font-medium'
                                }
                              >
                                {t}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </VStack>
                    <VStack className="gap-1.5">
                      <Text className="text-sm font-medium">
                        {idType === 'BVN' || idType === 'NIN' ? `${idType} (11 digits)` : 'ID number'}
                      </Text>
                      <Input>
                        <InputField
                          placeholder={idType === 'BVN' || idType === 'NIN' ? '12345678901' : 'ID number'}
                          value={idNumber}
                          onChangeText={(v) => {
                            setIdNumber(v);
                            setError(null);
                          }}
                          keyboardType={
                            idType === 'BVN' || idType === 'NIN' ? 'number-pad' : 'default'
                          }
                          maxLength={idType === 'BVN' || idType === 'NIN' ? 11 : 30}
                          returnKeyType="done"
                          onSubmitEditing={goNext}
                        />
                      </Input>
                    </VStack>
                  </VStack>
                )}

                {step === 3 && (
                  <VStack className="gap-2">
                    {reviewRows.map((row) => (
                      <Pressable
                        key={row.label}
                        onPress={() => {
                          setError(null);
                          setStep(row.goto);
                        }}
                        className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 active:opacity-70"
                      >
                        <VStack className="gap-0.5">
                          <Text className="text-xs font-medium text-typography-gray">{row.label}</Text>
                          <Text className="text-[15px] font-semibold">{row.value || '—'}</Text>
                        </VStack>
                        <Text className="text-sm font-semibold text-primary">Edit</Text>
                      </Pressable>
                    ))}
                  </VStack>
                )}
              </Animated.View>

              {error && <Text className="text-sm text-destructive">{error}</Text>}
            </VStack>
          </ScrollView>

          <View style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }} className="px-6">
            {step < TOTAL - 1 ? (
              <AppButton title="Continue" onPress={goNext} variant="dark" />
            ) : (
              <AppButton title="Submit for verification" onPress={submit} loading={busy} variant="dark" />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

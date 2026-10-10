import { AppButton } from '@/components/common/AppButton';
import { AuthDivider, AuthShell } from '@/components/features/auth/AuthShell';
import { AppleButton, GoogleButton } from '@/components/features/auth/SocialButtons';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { DEMO_MODE, requestEmailToken, verifyEmailToken } from '@/utils/otp';
import { saveSession } from '@/utils/session';
import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated, { FadeInUp, SlideInRight } from 'react-native-reanimated';

type EmailOtpJourneyProps = {
  /** Step 1 copy — asking for the email. */
  emailTitle: string;
  emailBody: string;
  /** Step 2 copy — the title; the subtitle is built from the email. */
  codeTitle: string;
  socialMode: 'signup' | 'login';
  socialLabel: string;
  footer: ReactNode;
  onAuthenticated: () => void;
};

const TOTAL = 2;
const CODE_LENGTH = 6;

/**
 * Passwordless auth journey shared by signup and login: email first,
 * then the 6-digit code sent to that inbox. One question at a time.
 */
export function EmailOtpJourney({
  emailTitle,
  emailBody,
  codeTitle,
  socialMode,
  socialLabel,
  footer,
  onAuthenticated,
}: EmailOtpJourneyProps) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (step !== 1 || cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, cooldown]);

  const goBack = () => {
    if (step === 0) {
      router.back();
      return;
    }
    setError(null);
    setStep(0);
  };

  const sendCode = async () => {
    const value = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setError('That email does not look right. Your code needs a home.');
      return;
    }
    setError(null);
    setSending(true);
    try {
      const res = await requestEmailToken(value);
      setDemoCode(res.demoCode);
      setCode('');
      setCooldown(res.resendCooldownSec);
      setStep(1);
    } catch {
      setError('Could not send the code. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || sending) return;
    await sendCode();
  };

  const verify = async () => {
    if (code.trim().length < CODE_LENGTH) {
      setError(`Enter the ${CODE_LENGTH}-digit code from your inbox.`);
      return;
    }
    setError(null);
    setVerifying(true);
    try {
      const value = email.trim().toLowerCase();
      await verifyEmailToken(value, code);
      await saveSession({ provider: 'email', userId: value, email: value });
      onAuthenticated();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That code did not work. Try again.');
    } finally {
      setVerifying(false);
    }
  };

  const title = step === 0 ? emailTitle : codeTitle;
  const body =
    step === 0
      ? emailBody
      : `We sent a ${CODE_LENGTH}-digit code to ${email.trim().toLowerCase()}. It expires in 10 minutes.`;

  return (
    <AuthShell title={title} body={body} onBack={goBack} footer={footer}>
      {/* Progress */}
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

      <Animated.View key={step} entering={SlideInRight.duration(350)}>
        {step === 0 && (
          <VStack className="gap-3">
            <VStack className="gap-1.5">
              <Text className="text-sm font-medium">Email</Text>
              <Input>
                <InputField
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    setError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={sendCode}
                />
              </Input>
            </VStack>
            {error && <Text className="text-sm text-destructive">{error}</Text>}
            <AppButton title="Sign me up" onPress={sendCode} loading={sending} variant="dark" />
            <AuthDivider label="or continue instantly" />
            <GoogleButton label={socialLabel} onAuthenticated={onAuthenticated} />
            <AppleButton mode={socialMode} onAuthenticated={onAuthenticated} />
          </VStack>
        )}

        {step === 1 && (
          <VStack className="gap-3">
            <Pressable
              onPress={() => {
                setError(null);
                setStep(0);
              }}
              className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 active:opacity-70"
            >
              <VStack className="gap-0.5">
                <Text className="text-xs font-medium text-typography-gray">Code sent to</Text>
                <Text className="text-[15px] font-semibold">{email.trim().toLowerCase()}</Text>
              </VStack>
              <Text className="text-sm font-semibold text-primary">Edit</Text>
            </Pressable>

            <VStack className="gap-1.5">
              <Text className="text-sm font-medium">6-digit code</Text>
              <Input>
                <InputField
                  placeholder="123456"
                  value={code}
                  onChangeText={(v) => {
                    setCode(v.replace(/\D/g, '').slice(0, CODE_LENGTH));
                    setError(null);
                  }}
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  autoFocus
                  maxLength={CODE_LENGTH}
                  returnKeyType="done"
                  onSubmitEditing={verify}
                />
              </Input>
            </VStack>

            {DEMO_MODE && demoCode && (
              <Text className="rounded-2xl bg-secondary px-4 py-3 text-center text-sm font-semibold">
                Demo mode — your code is {demoCode}
              </Text>
            )}

            {error && <Text className="text-sm text-destructive">{error}</Text>}
            <AppButton title="Verify code" onPress={verify} loading={verifying} variant="dark" />

            <HStack className="items-center justify-center gap-1">
              <Text className="text-sm text-typography-gray">Did nothing arrive?</Text>
              <Pressable onPress={resend} hitSlop={8} disabled={cooldown > 0 || sending}>
                <Text
                  className={
                    cooldown > 0 || sending
                      ? 'text-sm font-semibold text-typography-gray'
                      : 'text-sm font-semibold text-primary'
                  }
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        )}
      </Animated.View>
    </AuthShell>
  );
}

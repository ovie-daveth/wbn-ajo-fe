import { useEffect, useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Check, RefreshCw, ScanFace } from 'lucide-react-native';
import { AppButton } from '@/components/common/AppButton';
import { BottomSheetModal } from '@/components/common/BottomSheetModal';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export type LivenessResult = { score: number };

const PROMPTS = [
  'Look straight at the camera',
  'Blink slowly',
  'Turn your head left',
  'Turn your head right',
  'Smile!',
];

const PROMPT_MS = 2000;

type Phase = 'intro' | 'live' | 'demo' | 'done';

/** Front-camera preview (or placeholder) with the face-oval guide. */
function FaceFrame({
  live,
  onMountError,
  children,
}: {
  live: boolean;
  onMountError: () => void;
  children?: ReactNode;
}) {
  return (
    <View className="relative h-72 w-full overflow-hidden rounded-[28px] bg-black">
      {live ? (
        <CameraView
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          facing="front"
          mirror
          onMountError={onMountError}
        />
      ) : (
        <View className="absolute inset-0 items-center justify-center bg-secondary">
          <ScanFace size={64} color="#64748B" />
        </View>
      )}
      {/* Oval guide */}
      <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
        <View className="h-56 w-40 rounded-full border-4 border-white/80" />
      </View>
      {children}
    </View>
  );
}

/**
 * Simulated face liveness check. Runs the guided prompt sequence over the
 * front camera (or a placeholder in demo mode) and reports a mock match
 * score. Success arrives as a bottom sheet sliding over the live frame.
 *
 * TODO (backend): replace the timer with real liveness API calls — capture
 * frames via `takePictureAsync` and POST them to the verification endpoint,
 * then complete with the server's score instead of a random one.
 */
export function LivenessCheck({ onComplete }: { onComplete: (r: LivenessResult) => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>('intro');
  const [promptIdx, setPromptIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [denied, setDenied] = useState(false);
  const [mountError, setMountError] = useState(false);
  const [usedCamera, setUsedCamera] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (phase !== 'live' && phase !== 'demo') return;
    if (promptIdx < PROMPTS.length) {
      const t = setTimeout(() => setPromptIdx((i) => i + 1), PROMPT_MS);
      return () => clearTimeout(t);
    }
    const next = 0.94 + Math.random() * 0.05;
    setScore(next);
    setPhase('done');
    return undefined;
  }, [phase, promptIdx]);

  const start = async () => {
    setDenied(false);
    setRequesting(true);
    try {
      const res = await requestPermission();
      if (res.granted) {
        setUsedCamera(true);
        setPromptIdx(0);
        setPhase('live');
      } else {
        setDenied(true);
      }
    } finally {
      setRequesting(false);
    }
  };

  const startDemo = () => {
    setDenied(false);
    setMountError(false);
    setPromptIdx(0);
    setPhase('demo');
  };

  if (phase === 'intro') {
    return (
      <VStack className="gap-3">
        <View className="items-center py-2">
          <View className="rounded-full bg-primary p-4">
            <ScanFace size={28} color="#fff" />
          </View>
        </View>
        <Text className="text-center text-[14px] leading-6 text-typography-gray">
          Hold your face inside the oval and follow the prompts. It takes about 10 seconds — blink,
          turn, smile.
        </Text>
        {permission === null && (
          <Text className="text-center text-xs text-typography-gray">Checking camera access…</Text>
        )}
        {denied && (
          <Text className="text-center text-sm text-destructive">
            Camera access was denied. Allow it to continue, or use the demo check.
          </Text>
        )}
        <AppButton title="Start face check" onPress={start} loading={requesting} variant="dark" />
        <AppButton title="Use demo instead" onPress={startDemo} variant="ghost" />
      </VStack>
    );
  }

  if (phase === 'done') {
    const cont = () => onCompleteRef.current({ score });
    return (
      <VStack className="gap-3">
        {/* Captured face stays up behind the sheet */}
        <FaceFrame live={usedCamera && !mountError} onMountError={() => {}} />
        <HStack className="items-center justify-center gap-1">
          <Check size={13} color="#10B981" />
          <Text className="text-xs text-typography-gray">
            Your capture stays on this device
          </Text>
        </HStack>
        {/* Same bottom sheet as the KYC gate */}
        <BottomSheetModal visible onRequestClose={cont}>
          <VStack className="gap-4">
            <View className="items-center">
              <View className="rounded-full bg-emerald-500 p-4">
                <Check size={28} color="#fff" />
              </View>
            </View>
            <Heading className="text-center text-[22px] font-extrabold">Face verified</Heading>
            <Text className="text-center text-[14px] leading-6 text-typography-gray">
              {Math.round(score * 100)}% match · liveness confirmed. Your ID now belongs to a
              live person.
            </Text>
            <AppButton title="Continue" onPress={cont} variant="dark" />
          </VStack>
        </BottomSheetModal>
      </VStack>
    );
  }

  const progress = Math.min(1, (promptIdx + 1) / PROMPTS.length);

  return (
    <VStack className="gap-3">
      <FaceFrame live={phase === 'live' && !mountError} onMountError={() => setMountError(true)}>
        {mountError && phase === 'live' && (
          <View className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/70 p-3">
            <Text className="text-center text-xs text-white">
              Camera did not start on this device.
            </Text>
          </View>
        )}
      </FaceFrame>

      {/* Current prompt + progress */}
      <VStack className="gap-2">
        <HStack className="items-center gap-1.5">
          {PROMPTS.map((p, i) => (
            <View
              key={p}
              className={
                i < promptIdx
                  ? 'h-1.5 flex-1 rounded-full bg-emerald-500'
                  : i === promptIdx
                    ? 'h-1.5 flex-1 rounded-full bg-primary'
                    : 'h-1.5 flex-1 rounded-full bg-border'
              }
            />
          ))}
        </HStack>
        <Text className="text-center text-[15px] font-bold">
          {promptIdx < PROMPTS.length ? PROMPTS[promptIdx] : 'Capturing…'}
        </Text>
        <View className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <View style={{ width: `${progress * 100}%` }} className="h-full rounded-full bg-primary" />
        </View>
      </VStack>

      {mountError ? (
        <AppButton title="Continue in demo" onPress={startDemo} variant="dark" />
      ) : (
        <HStack className="items-center justify-center gap-1">
          <RefreshCw size={13} color="#64748B" />
          <Text className="text-xs text-typography-gray">
            {phase === 'demo' ? 'Demo check — no video leaves your phone' : 'Checking liveness…'}
          </Text>
        </HStack>
      )}
    </VStack>
  );
}

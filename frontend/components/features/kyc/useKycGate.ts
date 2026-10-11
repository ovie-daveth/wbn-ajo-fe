import { useState } from 'react';
import { router } from 'expo-router';
import { isKycVerified, loadProfile } from '@/utils/profile';

type GatedPath = '/contribute' | '/withdraw';

/**
 * Shared money-movement gate: verified members go straight through,
 * everyone else gets the KYC modal first (then lands in `/kyc` with a
 * return trip to where they were headed). Used by home and wallet.
 */
export function useKycGate() {
  const [gateOpen, setGateOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<GatedPath>('/contribute');

  const requestPath = async (path: GatedPath) => {
    const profile = await loadProfile();
    if (!isKycVerified(profile)) {
      setPendingPath(path);
      setGateOpen(true);
      return;
    }
    router.push(path);
  };

  const requestContribute = () => requestPath('/contribute');
  const requestWithdraw = () => requestPath('/withdraw');

  const closeGate = () => setGateOpen(false);

  const finishKyc = () => {
    setGateOpen(false);
    router.push({ pathname: '/kyc', params: { returnTo: pendingPath } });
  };

  return { gateOpen, closeGate, requestContribute, requestWithdraw, finishKyc };
}

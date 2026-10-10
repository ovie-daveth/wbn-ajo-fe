import * as SecureStore from 'expo-secure-store';

/**
 * Member profile + KYC record.
 *
 * DEMO STUB — stored locally until the backend provides member endpoints.
 * `submitKyc` marks the profile `verified` immediately; against the real
 * backend it should create a `pending` review instead:
 *   submit flow -> POST /members/profile + POST /members/kyc { idType, idNumber }
 */

export type KycStatus = 'incomplete' | 'pending' | 'verified';

export type IdType = 'BVN' | 'NIN' | "Driver's License" | "Voter's Card" | 'Intl. Passport';

export const ID_TYPES: IdType[] = ['BVN', 'NIN', "Driver's License", "Voter's Card", 'Intl. Passport'];

export type MemberProfile = {
  fullName: string;
  phone: string;
  /** YYYY-MM-DD. */
  dob: string;
  address: string;
  idType: IdType | '';
  idNumber: string;
  kycStatus: KycStatus;
  updatedAt: string | null;
};

const PROFILE_KEY = 'wbn-invest-profile';

export const EMPTY_PROFILE: MemberProfile = {
  fullName: '',
  phone: '',
  dob: '',
  address: '',
  idType: '',
  idNumber: '',
  kycStatus: 'incomplete',
  updatedAt: null,
};

export async function loadProfile(): Promise<MemberProfile> {
  const raw = await SecureStore.getItemAsync(PROFILE_KEY);
  if (!raw) return { ...EMPTY_PROFILE };
  try {
    return { ...EMPTY_PROFILE, ...(JSON.parse(raw) as Partial<MemberProfile>) };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export async function saveProfile(profile: MemberProfile): Promise<void> {
  await SecureStore.setItemAsync(
    PROFILE_KEY,
    JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }),
  );
}

export async function clearProfile(): Promise<void> {
  await SecureStore.deleteItemAsync(PROFILE_KEY);
}

/** Every profile + KYC field filled in. */
export function isProfileComplete(p: MemberProfile): boolean {
  return (
    p.fullName.trim().length >= 2 &&
    p.phone.replace(/\D/g, '').length >= 7 &&
    isValidDob(p.dob) &&
    p.address.trim().length >= 6 &&
    p.idType !== '' &&
    isValidIdNumber(p.idType, p.idNumber)
  );
}

/** Allowed to move money. Demo: submit verifies instantly (see header). */
export function isKycVerified(p: MemberProfile): boolean {
  return p.kycStatus === 'verified' && isProfileComplete(p);
}

export function isValidDob(raw: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) return false;
  const [, y, mo, d] = m.map(Number);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return false;
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return false;
  // Must be born in the past and at least 16 years ago.
  const sixteen = new Date();
  sixteen.setFullYear(sixteen.getFullYear() - 16);
  return date <= sixteen;
}

/** BVN and NIN are 11 digits; other IDs just need a plausible value. */
export function isValidIdNumber(idType: IdType | '', idNumber: string): boolean {
  const digits = idNumber.replace(/\D/g, '');
  if (idType === 'BVN' || idType === 'NIN') return digits.length === 11;
  return idNumber.trim().length >= 5;
}

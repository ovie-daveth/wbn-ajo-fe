// wbn-Invest brand constants — the ONLY place raw brand values live
// (alongside components/ui/gluestack-ui-provider/config.ts).
// Components must use theme tokens (bg-primary, text-foreground, …), never these directly,
// except WivLogo / gradients which need raw hex stops. See DESIGN.md §2.

export const brandBlue = {
  50: '#EFF4FF',
  100: '#DCE6FF',
  200: '#B9CBFF',
  300: '#8FABFF',
  400: '#5B85FF',
  500: '#2F67F6',
  600: '#1F4FD8',
  700: '#1A41AE',
  800: '#162F7A',
  900: '#101F4E',
  950: '#0A1430',
} as const;

export const brandInk = {
  950: '#0A0F1E',
  900: '#111A30',
  700: '#2A3754',
  500: '#64748B',
  100: '#E8EDF5',
  50: '#F4F6FA',
  paper: '#FFFFFF',
} as const;

export type ThemeMode = 'light' | 'dark';

/** Hero gradient stops (top → surface) for onboarding + invest header. */
export function heroGradientStops(mode: ThemeMode): [string, string, string, string] {
  return mode === 'dark'
    ? [brandBlue[950], brandBlue[800], brandBlue[600], brandInk[950]]
    : [brandBlue[700], brandBlue[500], brandBlue[300], brandInk.paper];
}

export const radius = {
  card: 20,
  tile: 14,
  pill: 999,
} as const;

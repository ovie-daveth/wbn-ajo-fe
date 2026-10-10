# wbn-Invest — Design System

> App: **wbn-Invest** — a member-owned **cooperative**, not a bank.
> Logo: **WIV** test combo (monogram + wordmark, text-based, no image asset yet)
> Stack: Expo Router + NativeWind v4 + Gluestack UI v4 (copy-paste primitives in `components/ui/`)
> Money: **Naira (₦, en-NG)** · Loans priced in **APR** · **No interest on savings — never render AER,
> yields, or earnings copy.**
> Single rule: **no hardcoded colors in components** — everything via theme tokens
> (`bg-background`, `text-foreground`, `bg-primary`, …). Raw values live in exactly two places:
> `components/ui/gluestack-ui-provider/config.ts` (CSS vars) and `constants/theme.ts` (brand constants).

## 1. Brand

| Item | Spec |
|---|---|
| Name | wbn-Invest |
| What it is | Member cooperative (ajo-style). Say "co-op", "members", "contributions" — never "bank", "savings account", "interest earnings" |
| Core loop | Weekly/monthly **contributions** prove continued membership → membership unlocks **low-APR loans** |
| Logo (test combo) | `WIV` monogram in rounded square + `wbn-Invest` wordmark beside it |
| Monogram | Bold geometric sans, tight tracking, white `WIV` on primary-blue tile (`rounded-xl`, tile = `bg-primary`) |
| Wordmark | `wbn-` in foreground color + `Invest` in primary blue, semibold, lowercase `wbn` |
| App icon / splash | Blue tile + white `WIV` (`app.json` already set) |
| Voice | Short, plain, money-calming. No jargon. Numbers always formatted (`₦85,500.00`, `3.00% APR`) |

### `WivLogo` component spec (lives in `components/brand/`)

```tsx
type WivLogoProps = {
  size?: 'sm' | 'md' | 'lg';        // tile 32 / 44 / 56
  variant?: 'tile' | 'tile-wordmark' | 'mono'; // mono = single-color for splash/headers
  dark?: boolean;                   // mono on dark hero backgrounds
};
// tile: <Box className="items-center justify-center rounded-xl bg-primary"> + <Text>WIV</Text>
// wordmark: <HStack><WivLogo variant="tile"/><Text>wbn-<Text className="text-primary">Invest</Text></Text></HStack>
```

## 2. Color — Blue / White / Black (+ shades)

Primary is **blue**. White and black are surfaces/text, never accents. Neutrals are blue-tinted
(not pure gray) so the app feels like one family.

### 2.1 Brand blue scale

| Token | Hex | Usage |
|---|---|---|
| `blue-50` | `#EFF4FF` | light tinted surfaces, pressed states on white |
| `blue-100` | `#DCE6FF` | Pocket icon chips, info backgrounds |
| `blue-200` | `#B9CBFF` | borders on blue surfaces |
| `blue-300` | `#8FABFF` | gradient mid-stop, disabled text on blue |
| `blue-400` | `#5B85FF` | dark-mode primary surface |
| `blue-500` | `#2F67F6` | **primary light** (buttons, active states) |
| `blue-600` | `#1F4FD8` | primary pressed / gradient base |
| `blue-700` | `#1A41AE` | gradient deep-stop (hero top) |
| `blue-800` | `#162F7A` | only inside gradients |
| `blue-900` | `#101F4E` | dark hero deep-stop |
| `blue-950` | `#0A1430` | darkest gradient stop |

### 2.2 Neutrals (blue-tinted black/white)

| Token | Hex | Usage |
|---|---|---|
| `ink-950` | `#0A0F1E` | dark-mode background |
| `ink-900` | `#111A30` | dark cards |
| `ink-700` | `#2A3754` | dark borders |
| `ink-500` | `#64748B` | muted text both modes |
| `ink-100` | `#E8EDF5` | light borders / inputs |
| `ink-50` | `#F4F6FA` | light secondary surfaces |
| `paper` | `#FFFFFF` | light background / cards |

### 2.3 Light theme → token mapping (`config.ts` `colors.light` — applied)

| CSS var | RGB | ≈ Hex | Notes |
|---|---|---|---|
| `--primary` | `47 103 246` | `#2F67F6` | blue-500 |
| `--primary-foreground` | `255 255 255` | white | button text |
| `--background` | `255 255 255` | white | screen bg |
| `--foreground` | `10 15 30` | `#0A0F1E` | text |
| `--card` / `--card-foreground` | `255 255 255` / `10 15 30` | | cards |
| `--secondary` | `244 246 250` | `#F4F6FA` | ink-50, action tiles |
| `--muted` / `--muted-foreground` | `244 246 250` / `100 116 139` | | captions, `Due Friday` |
| `--border` / `--input` | `232 237 245` | `#E8EDF5` | |
| `--ring` | `47 103 246` | blue focus ring | |
| `--accent` / `--accent-foreground` | `239 244 255` / `31 79 216` | blue-50 highlights | |
| `--destructive` | `231 0 11` | unchanged | |

### 2.4 Dark theme → token mapping (`config.ts` `colors.dark` — applied)

| CSS var | RGB | ≈ Hex | Notes |
|---|---|---|---|
| `--primary` | `91 133 255` | `#5B85FF` | blue-400, readable on near-black |
| `--primary-foreground` | `10 20 48` | `#0A1430` | text on primary |
| `--background` | `10 15 30` | `#0A0F1E` | ink-950 |
| `--foreground` | `241 245 249` | `#F1F5F9` | |
| `--card` / `--card-foreground` | `17 26 48` / `241 245 249` | ink-900 | |
| `--secondary` / `--muted` | `24 34 62` | | action tiles on dark |
| `--muted-foreground` | `148 163 184` | | |
| `--border` / `--input` | `42 55 84` | `#2A3754` | |
| `--ring` | `91 133 255` | | |
| `--accent` / `--accent-foreground` | `31 52 120` / `185 203 255` | deep blue highlight | |

### 2.5 Hero gradients

`expo-linear-gradient` full-bleed behind the top section, fading into `bg-background`.

| Mode | Stops (top → surface) |
|---|---|
| Light | `#1A41AE` → `#2F67F6` (45%) → `#8FABFF` (75%) → `background` |
| Dark | `#0A1430` → `#162F7A` (45%) → `#1F4FD8` (75%) → `background` |

Glass cards on the gradient (bank cards, contributions pill): semi-transparent white
(`bg-white/25`, `border-white/30`) with the `WIV` mark, never solid white.

## 3. Typography

System stack via NativeWind (`font-sans` default). Three roles only:

| Role | Style | Example from screens |
|---|---|---|
| Display | 32–40, extrabold, tight | `₦85,500.00`, `Link your account in one place` |
| Title | 17–20, semibold/bold | `Contributions`, `Emergency Loan` |
| Body / Caption | 14–15 regular, 12–13 muted | `Total contributions · Active member`, `Up to ₦200,000` |

Money: Naira prefix, 2 decimals for totals (`₦85,500.00`), whole naira for dues/goals (`₦5,000`).
Loan rates as `3.00% APR` + one-line explainer beneath. **No savings-interest copy anywhere.**

## 4. Shape, spacing, elevation

- Radius: cards `rounded-2xl`, pills/action tiles `rounded-xl`, buttons `rounded-full` (primary CTA)
  or `rounded-xl` (in-card). Bottom tab bar: floating `rounded-full` bar.
- Spacing: screen padding `p-5`, card gaps `gap-3/4`, section gap `gap-5`.
- Shadows: `shadow-soft-1` on the floating tab bar (both modes use borders elsewhere).
- Bottom nav: floating bar (`rounded-full border-border bg-secondary`), exactly 3 icons
  (Home / Analysis / Wallet), active item = black pill w/ white icon in light mode (invert in dark).

## 5. Compartmentalised architecture (reusable components)

```
app/                          # ROUTES ONLY — compose, never implement
  _layout.tsx                 # GluestackUIProvider + theme + font + splash, starts at (onboarding)
  (onboarding)/               # one, two, three (shared OnboardingShell)
  (tabs)/                     # home (Invest dashboard, landing), analysis, wallet + floating InvestTabBar
  modal.tsx
components/
  ui/                         # VENDOR primitives (Gluestack copy-paste, @ts-nocheck). Never edit styling here.
  brand/                      # WivLogo (props: size, variant, dark)
  common/                     # AppButton, AppCard, SectionHeader, MoneyText, RateText,
                              # QuickAction, GlassCard, EmptyState, ThemedIcon, InvestTabBar
  features/
    onboarding/               # OnboardingShell, BankCardStack, ContributionPreview, LoanPreview
    invest/                   # BalanceHeader, PocketPill, QuickActionGrid, LoanCards, ContributionsSection
constants/
  theme.ts                    # blues, heroGradientStops(mode), radius (single import for features)
  rates.ts                    # ALL money figures (env-overridable, see §9) — screens read from `rates`
  Colors.ts                   # legacy tab tint — keep in sync with theme.ts
hooks/                        # useThemeMode
utils/                        # formatMoney, formatWholeNaira, formatApr
```

### Rules

1. Screens import from `components/features/*` and `components/common` only — never from `ui/` directly.
2. Features compose `common` + `ui`; features never import each other.
3. `common` props are data + callbacks (`title`, `value`, `onPress`), never screens or routing.
4. Theming only via tokens + `constants/theme.ts`. A `grep -r "#[0-9A-Fa-f]" components/common components/features` must return nothing (except `theme.ts`/`brand/`).
5. Every feature folder owns: component, `*.types.ts` (if >2 props), and a visual state list (default / loading / empty / error) in the file header comment.
6. Cooperative language: contributions / dues / membership / loans / APR. Banned words in UI copy: bank, savings account, interest earnings, AER.

### Shared `common` API (keep stable)

```tsx
AppButton({ title, onPress, variant?: 'primary'|'dark'|'outline'|'ghost', shape?: 'pill'|'rounded', loading?, disabled? })
AppCard({ children, className?: string })            // rounded-2xl bg-card border p-5
SectionHeader({ title, actionLabel, onAction })      // "Contributions" + right "Contribute"
MoneyText({ children, size?: 'display'|'title'|'body' })
RateText({ children })                               // "from 3.00% APR"
QuickAction({ icon, label, onPress })                // Contribute/Borrow/Repay/Receipts tile
EmptyState({ icon, title, body?, actionLabel?, onAction? })
```

## 6. Screens (cooperative, blue-skinned)

### 6.1 Onboarding (3 screens, shared `OnboardingShell`: gradient + dots + Skip/Back + bottom sheet)

1. **Link your account** — fanned `BankCardStack` (tops splayed, converging at bottom), `WIV` mark,
   `Card Number 1234 5678 9012 3456`, `Expiry 12/28`. Title `Link your account in one place`,
   body about connecting bank accounts for an overview. CTA: Continue.
2. **Contributions** — `ContributionPreview` (Weekly `₦5,000` / Monthly `₦20,000` glass cards).
   Title `Stay active with contributions`, body: weekly/monthly contributions show continued
   membership and unlock low-interest co-op loans. CTA: Continue.
3. **Member loans** — `LoanPreview` (`₦500,000`, `Borrow up to · from 3.00% APR`, Emergency/Business pills).
   Title `Low-interest loans for members`, body about eligibility through contributions.
   Footer: black `Sign up for free` pill + `Already signed up? Log in` → both enter `(tabs)/invest`.

### 6.2 Home — Invest dashboard (`(tabs)/home`, post-onboarding landing)

Order top→bottom, all inside one `ScrollView` except the floating tab bar:

1. `BalanceHeader` (on gradient): avatar left, bell right, centered `₦85,500.00` display +
   `Total contributions · Active member` caption.
2. `PocketPill`: glass row — `WIV` chip + `Contributions / October · Paid` + `₦20,000.00`.
3. `QuickActionGrid`: 4 `QuickAction` tiles (`Contribute`, `Borrow`, `Repay`, `Receipts`).
4. `LoanCards`: 2-col `AppCard`s — `Emergency Loan / from 3.00% APR / Up to ₦200,000`,
   `Business Loan / from 5.00% APR / Up to ₦1,000,000`, each with blue chip icon.
5. `ContributionsSection` (`SectionHeader` title `Contributions`, action `Contribute`, subtitle
   `Weekly and monthly dues keep your membership active`): rows with check icon + name +
   amount + status (`Weekly Contribution ₦5,000 Paid`, `October Dues ₦20,000 Due Friday`).
6. `InvestTabBar`: floating pill, exactly 3 icons (Home / Analysis / Wallet), active = filled pill.
   Home renders the dashboard until the real Home design lands; Analysis/Wallet are branded
   placeholders.

Dark mode: same layout; gradient stops switch (§2.5); glass stays white-translucent; tiles go
`bg-secondary`; active tab pill becomes white w/ black icon.

## 7. States, a11y, motion

- Every money row: `default` / `loading` (Skeleton) / `empty` (`₦0` + muted status) / `error` (Alert + retry).
- Touch targets ≥ 44pt; `QuickAction` tiles 64pt. Contrast: white-on-blue-500 ≥ 4.5:1 for body text;
  captions on blue use blue-100, never white/70 below 12pt.
- Motion (`react-native-reanimated`, already installed): card-stack entrance (translate/rotate spring),
  balance count-up on mount, tab-pill slide. Respect reduced motion (render final state).

## 8. Status

- [x] `app.json` → wbn-Invest / `wbn-invest` / `wbninvest`, blue icon + splash.
- [x] Blue tokens in `config.ts` (light + dark, incl. `--card-foreground` the starter kit omitted).
- [x] `constants/theme.ts`, `utils/format.ts` (₦, en-NG, APR), `expo-linear-gradient`.
- [x] `brand/WivLogo` + `common/*` library; onboarding ×3; Invest landing + 3-tab bar.
- [x] Cooperative conversion: Naira everywhere, APR for loans, contributions/dues model,
      no interest-on-savings copy (AER fully removed).
- [x] Auth screens (`(auth)/signup`, `(auth)/login`): passwordless email OTP —
      shared `EmailOtpJourney` (email → 6-digit code, resend cooldown, `utils/otp.ts`
      demo stub until the backend `/auth/email/*` endpoints land) + Google
      (expo-auth-session, needs OAuth client IDs in `.env` + dev build) + Apple
      (native button, iOS, works in Expo Go). Sessions persist in SecureStore (`utils/session.ts`). No backend yet.
- [x] Rates centralized in `constants/rates.ts` (env-overridable, §9 reference).
- [ ] Real Home design (Invest dashboard currently stands in; move it aside then) /
      Analysis / Wallet tab content.

## 9. Configurable rates (env → `constants/rates.ts` → every screen)

All money figures live in **`constants/rates.ts`** — components read from `rates`, never hardcode.
Override with `EXPO_PUBLIC_*` vars (see `.env.example`); values bake in at startup, so restart
after changing: `npx expo start -c`.

| Env var | Default | Surfaces |
|---|---|---|
| `EXPO_PUBLIC_EMERGENCY_LOAN_APR` | `5` | Onboarding 3 body + `LoanPreview` caption/pills, `LoanCards` Emergency rate |
| `EXPO_PUBLIC_BUSINESS_LOAN_APR` | `10` | `LoanPreview` pills, `LoanCards` Business rate |
| `EXPO_PUBLIC_HEADLINE_LOAN_MAX` | `500000` | Onboarding 3 body + `LoanPreview` display (`₦500,000`) |
| `EXPO_PUBLIC_EMERGENCY_LOAN_MAX` | `200000` | `LoanCards` Emergency cap |
| `EXPO_PUBLIC_BUSINESS_LOAN_MAX` | `1000000` | `LoanCards` Business cap |
| `EXPO_PUBLIC_WEEKLY_CONTRIBUTION` | `5000` | `ContributionPreview` Weekly card, `ContributionsSection` row |
| `EXPO_PUBLIC_MONTHLY_CONTRIBUTION` | `20000` | `ContributionPreview` Monthly card, `ContributionsSection` dues, `PocketPill` default |

Formatting stays in `utils/format.ts` (`formatMoney`, `formatWholeNaira`, `formatApr`).
Rule addition: a `grep -r "₦[0-9]\|[0-9]% APR" app components --include="*.tsx"` outside
`constants/rates.ts` is a bug — route it through `rates`.
- [ ] Real auth + backend wiring behind Sign up / Log in (currently enter directly).

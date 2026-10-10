// @ts-nocheck
import { vars } from 'nativewind';

// Raw color values - update these and they sync everywhere
// Brand: wbn-Invest — primary blue + blue-tinted neutrals (see DESIGN.md §2)
export const colors = {
  light: {
    '--primary': '47 103 246',
    '--primary-foreground': '255 255 255',
    '--card': '255 255 255',
    '--card-foreground': '10 15 30',
    '--secondary': '244 246 250',
    '--secondary-foreground': '10 15 30',
    '--background': '255 255 255',
    '--popover': '255 255 255',
    '--popover-foreground': '10 15 30',
    '--muted': '244 246 250',
    '--muted-foreground': '100 116 139',
    '--destructive': '231 0 11',
    '--foreground': '10 15 30',
    '--border': '232 237 245',
    '--input': '232 237 245',
    '--ring': '47 103 246',
    '--accent': '239 244 255',
    '--accent-foreground': '31 79 216',
  },
  dark: {
    '--primary-foreground': '10 20 48',
    '--primary': '91 133 255',
    '--card': '17 26 48',
    '--card-foreground': '241 245 249',
    '--secondary': '24 34 62',
    '--secondary-foreground': '241 245 249',
    '--background': '10 15 30',
    '--popover': '17 26 48',
    '--popover-foreground': '241 245 249',
    '--muted': '24 34 62',
    '--muted-foreground': '148 163 184',
    '--destructive': '255 100 103',
    '--foreground': '241 245 249',
    '--border': '42 55 84',
    '--input': '42 55 84',
    '--accent': '31 52 120',
    '--accent-foreground': '185 203 255',
    '--ring': '91 133 255',
  },
};

// Config for nativewind vars() - used by provider
export const config = {
  light: vars(colors.light),
  dark: vars(colors.dark),
};

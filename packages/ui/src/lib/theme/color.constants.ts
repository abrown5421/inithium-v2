import { ColorProperty, ThemeColorToken } from '@inithium/types';

export const THEME_TOKEN_CLASS_MAP: Readonly<Record<ColorProperty, Record<ThemeColorToken, string>>> = Object.freeze({
  bg: {
    danger: 'bg-red-600',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
  },
  text: {
    danger: 'text-red-600',
    success: 'text-emerald-600',
    warning: 'text-amber-500',
    info: 'text-sky-500',
  },
  border: {
    danger: 'border-red-600',
    success: 'border-emerald-600',
    warning: 'border-amber-500',
    info: 'border-sky-500',
  },
  outline: {
    danger: 'outline-red-600',
    success: 'outline-emerald-600',
    warning: 'outline-amber-500',
    info: 'outline-sky-500',
  },
  ring: {
    danger: 'ring-red-600',
    success: 'ring-emerald-600',
    warning: 'ring-amber-500',
    info: 'ring-sky-500',
  },
});
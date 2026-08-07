export const CORE_COLOR_TOKENS = [
  'primary',
  'secondary',
  'accent',
  'muted',
  'success',
  'warning',
  'info',
  'destructive',
] as const;

export type CoreColorToken = (typeof CORE_COLOR_TOKENS)[number];

export const CORE_COLOR_TOKEN_LABELS: Readonly<Record<CoreColorToken, string>> = {
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  muted: 'Muted',
  success: 'Success',
  warning: 'Warning',
  info: 'Info',
  destructive: 'Destructive',
};

export function isCoreColorToken(value: string): value is CoreColorToken {
  return (CORE_COLOR_TOKENS as readonly string[]).includes(value);
}

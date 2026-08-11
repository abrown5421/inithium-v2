import { cn } from '../utils/cn.js';
import type { CoreColorToken } from './color-tokens.js';

type TokenClassMap = Readonly<Record<CoreColorToken, string>>;

const TEXT: TokenClassMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  muted: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-info',
  destructive: 'text-destructive',
};

const TEXT_ON_FILL: TokenClassMap = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  accent: 'text-accent-foreground',
  muted: 'text-muted-foreground',
  success: 'text-success-foreground',
  warning: 'text-warning-foreground',
  info: 'text-info-foreground',
  destructive: 'text-destructive-foreground',
};

const BG_FILL: TokenClassMap = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  muted: 'bg-muted',
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
  destructive: 'bg-destructive',
};

const BORDER: TokenClassMap = {
  primary: 'border-primary',
  secondary: 'border-secondary',
  accent: 'border-accent',
  muted: 'border-muted-foreground/40',
  success: 'border-success',
  warning: 'border-warning',
  info: 'border-info',
  destructive: 'border-destructive',
};

const HOVER_BG_SOFT: TokenClassMap = {
  primary: 'hover:bg-primary/10',
  secondary: 'hover:bg-secondary/10',
  accent: 'hover:bg-accent/10',
  muted: 'hover:bg-muted/50',
  success: 'hover:bg-success/10',
  warning: 'hover:bg-warning/10',
  info: 'hover:bg-info/10',
  destructive: 'hover:bg-destructive/10',
};

const HOVER_BG_STRONG: TokenClassMap = {
  primary: 'hover:bg-primary/90',
  secondary: 'hover:bg-secondary/90',
  accent: 'hover:bg-accent/90',
  muted: 'hover:bg-muted/90',
  success: 'hover:bg-success/90',
  warning: 'hover:bg-warning/90',
  info: 'hover:bg-info/90',
  destructive: 'hover:bg-destructive/90',
};

const SOFT_BG: TokenClassMap = {
  primary: 'bg-primary/5',
  secondary: 'bg-secondary/5',
  accent: 'bg-accent/5',
  muted: 'bg-muted',
  success: 'bg-success/5',
  warning: 'bg-warning/5',
  info: 'bg-info/5',
  destructive: 'bg-destructive/5',
};

const SOFT_BORDER: TokenClassMap = {
  primary: 'border-primary/30',
  secondary: 'border-secondary/30',
  accent: 'border-accent/30',
  muted: 'border-muted-foreground/20',
  success: 'border-success/30',
  warning: 'border-warning/30',
  info: 'border-info/30',
  destructive: 'border-destructive/30',
};

const SOFT_ICON: TokenClassMap = {
  primary: '[&>svg]:text-primary',
  secondary: '[&>svg]:text-secondary',
  accent: '[&>svg]:text-accent',
  muted: '[&>svg]:text-muted-foreground',
  success: '[&>svg]:text-success',
  warning: '[&>svg]:text-warning',
  info: '[&>svg]:text-info',
  destructive: '[&>svg]:text-destructive',
};

const TOAST_BG: TokenClassMap = {
  primary: 'bg-[color-mix(in_oklab,var(--color-primary)_12%,var(--color-popover))]',
  secondary: 'bg-[color-mix(in_oklab,var(--color-secondary)_12%,var(--color-popover))]',
  accent: 'bg-[color-mix(in_oklab,var(--color-accent)_12%,var(--color-popover))]',
  muted: 'bg-[color-mix(in_oklab,var(--color-muted)_12%,var(--color-popover))]',
  success: 'bg-[color-mix(in_oklab,var(--color-success)_12%,var(--color-popover))]',
  warning: 'bg-[color-mix(in_oklab,var(--color-warning)_12%,var(--color-popover))]',
  info: 'bg-[color-mix(in_oklab,var(--color-info)_12%,var(--color-popover))]',
  destructive: 'bg-[color-mix(in_oklab,var(--color-destructive)_12%,var(--color-popover))]',
};

const TOAST_BORDER: TokenClassMap = {
  primary: 'border-primary/50',
  secondary: 'border-secondary/50',
  accent: 'border-accent/50',
  muted: 'border-muted-foreground/30',
  success: 'border-success/50',
  warning: 'border-warning/50',
  info: 'border-info/50',
  destructive: 'border-destructive/50',
};

const CHECKED_BG: TokenClassMap = {
  primary: 'data-[state=checked]:bg-primary',
  secondary: 'data-[state=checked]:bg-secondary',
  accent: 'data-[state=checked]:bg-accent',
  muted: 'data-[state=checked]:bg-muted',
  success: 'data-[state=checked]:bg-success',
  warning: 'data-[state=checked]:bg-warning',
  info: 'data-[state=checked]:bg-info',
  destructive: 'data-[state=checked]:bg-destructive',
};

const FOCUS_BORDER: TokenClassMap = {
  primary: 'focus-visible:border-primary',
  secondary: 'focus-visible:border-secondary',
  accent: 'focus-visible:border-accent',
  muted: 'focus-visible:border-muted-foreground/40',
  success: 'focus-visible:border-success',
  warning: 'focus-visible:border-warning',
  info: 'focus-visible:border-info',
  destructive: 'focus-visible:border-destructive',
};

const FOCUS_RING: TokenClassMap = {
  primary: 'focus-visible:ring-primary/50',
  secondary: 'focus-visible:ring-secondary/50',
  accent: 'focus-visible:ring-accent/50',
  muted: 'focus-visible:ring-muted-foreground/50',
  success: 'focus-visible:ring-success/50',
  warning: 'focus-visible:ring-warning/50',
  info: 'focus-visible:ring-info/50',
  destructive: 'focus-visible:ring-destructive/50',
};

const SELECTION_BG: TokenClassMap = {
  primary: 'selection:bg-primary',
  secondary: 'selection:bg-secondary',
  accent: 'selection:bg-accent',
  muted: 'selection:bg-muted',
  success: 'selection:bg-success',
  warning: 'selection:bg-warning',
  info: 'selection:bg-info',
  destructive: 'selection:bg-destructive',
};

const SELECTION_TEXT: TokenClassMap = {
  primary: 'selection:text-primary-foreground',
  secondary: 'selection:text-secondary-foreground',
  accent: 'selection:text-accent-foreground',
  muted: 'selection:text-muted-foreground',
  success: 'selection:text-success-foreground',
  warning: 'selection:text-warning-foreground',
  info: 'selection:text-info-foreground',
  destructive: 'selection:text-destructive-foreground',
};

export type ColorRecipe =
  | 'solid'
  | 'outlined'
  | 'ghost'
  | 'link'
  | 'soft'
  | 'toast'
  | 'plain'
  | 'fill'
  | 'border'
  | 'checked'
  | 'field';

/**
 * Maps a structural treatment + one of the 8 core tokens to a complete
 * Tailwind class string. `color` can't be a second independent `cva` axis
 * because its output depends on which structural recipe it's paired with
 * (a solid button and an outlined button need entirely different classes for
 * the same token) — so this stays a plain function, merged in via `cn()`.
 */
export function getColorRecipeClassName(recipe: ColorRecipe, color: CoreColorToken): string {
  switch (recipe) {
    case 'solid':
      return cn(BG_FILL[color], TEXT_ON_FILL[color], HOVER_BG_STRONG[color]);
    case 'outlined':
      return cn(BORDER[color], TEXT[color], HOVER_BG_SOFT[color]);
    case 'ghost':
      return cn(TEXT[color], HOVER_BG_SOFT[color]);
    case 'link':
      return cn(TEXT[color], 'hover:underline');
    case 'soft':
      return cn(SOFT_BORDER[color], SOFT_BG[color], TEXT[color], SOFT_ICON[color]);
    case 'toast':
      return cn(TOAST_BORDER[color], TOAST_BG[color], TEXT[color], SOFT_ICON[color]);
    case 'plain':
      return TEXT[color];
    case 'fill':
      return BG_FILL[color];
    case 'border':
      return BORDER[color];
    case 'checked':
      return CHECKED_BG[color];
    case 'field':
      return cn(TEXT[color], FOCUS_BORDER[color], FOCUS_RING[color], SELECTION_BG[color], SELECTION_TEXT[color]);
  }
}

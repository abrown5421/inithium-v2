import type { TailwindPalette } from './tailwind-palette.js';
import type { ThemeColorOption } from './theme-colors.js';

export interface ColorPickerProps {
  /** Controlled hex value, e.g. `#3b82f6`. */
  value?: string;
  /** Initial hex value when uncontrolled. */
  defaultValue?: string;
  /** Fires with a normalized 6-digit hex string whenever the color changes. */
  onValueChange?: (hex: string) => void;
  /** Semantic theme swatches offered in the panel. Pass `[]` to hide that tab. */
  themeColors?: readonly ThemeColorOption[];
  /** Tailwind family → shade palette offered in the panel. Pass `{}` to hide that tab. */
  tailwindColors?: TailwindPalette;
  placeholder?: string;
  disabled?: boolean;
  /** Marks the field as invalid and switches it to the destructive palette. */
  error?: boolean | string;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  swatchClassName?: string;
  contentClassName?: string;
}

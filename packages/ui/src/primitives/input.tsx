import * as React from 'react';
import { cn } from '../utils/cn.js';
import { resolveColorRecipeClassName } from '../theme/resolve-color-recipe.js';
import type { ColorToken } from '../theme/color-value.js';

const INPUT_NEUTRAL_FIELD_CLASSES =
  'focus-visible:border-ring focus-visible:ring-ring/50 selection:bg-primary selection:text-primary-foreground';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Marks the field as invalid and switches it to the destructive palette. */
  error?: boolean | string;
  /** One of the 8 core theme tokens for the focus ring and text selection. Omit for the neutral default. */
  color?: ColorToken;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, color, required, 'aria-invalid': ariaInvalid, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      required={required}
      aria-invalid={ariaInvalid ?? Boolean(error)}
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:ring-2',
        color ? resolveColorRecipeClassName('field', color) : INPUT_NEUTRAL_FIELD_CLASSES,
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

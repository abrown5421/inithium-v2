import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn.js';
import { resolveColorRecipeClassName } from '../theme/resolve-color-recipe.js';
import type { ColorToken } from '../theme/color-value.js';

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    font: {
      primary: 'font-primary',
      secondary: 'font-secondary',
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    font: 'sans',
  },
});

export type TextColor = 'default' | ColorToken;

function resolveTextColorClassName(color: TextColor): string {
  return color === 'default' ? 'text-foreground' : resolveColorRecipeClassName('plain', color);
}

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label' | 'small';
  asChild?: boolean;
  /** One of the 8 core theme tokens, or `'default'` for `text-foreground`. */
  color?: TextColor;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, size, weight, color, font, as = 'p', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : (as as React.ElementType);
    return (
      <Comp
        ref={ref}
        data-slot="text"
        className={cn(
          textVariants({ size, weight, font }),
          resolveTextColorClassName(color ?? 'default'),
          className,
        )}
        {...props}
      />
    );
  },
);
Text.displayName = 'Text';

export { textVariants };

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn.js';

const textVariants = cva('text-foreground', {
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
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      destructive: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
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
    tone: 'default',
    font: 'sans',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label' | 'small';
  asChild?: boolean;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, size, weight, tone, font, as = 'p', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : (as as React.ElementType);
    return (
      <Comp
        ref={ref}
        data-slot="text"
        className={cn(textVariants({ size, weight, tone, font }), className)}
        {...props}
      />
    );
  },
);
Text.displayName = 'Text';

export { textVariants };
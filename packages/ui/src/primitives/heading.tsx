import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn.js';

const headingVariants = cva('font-semibold tracking-tight text-balance text-foreground', {
  variants: {
    level: {
      1: 'text-4xl lg:text-5xl',
      2: 'text-3xl lg:text-4xl',
      3: 'text-2xl lg:text-3xl',
      4: 'text-xl lg:text-2xl',
      5: 'text-lg lg:text-xl',
      6: 'text-base lg:text-lg',
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
    level: 2,
    font: 'sans',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, font, asChild = false, ...props }, ref) => {
    const resolvedLevel = level ?? 2;
    const Comp = asChild ? Slot : ((`h${resolvedLevel}` as const) as React.ElementType);
    return (
      <Comp
        ref={ref}
        data-slot="heading"
        className={cn(headingVariants({ level: resolvedLevel, font }), className)}
        {...props}
      />
    );
  },
);
Heading.displayName = 'Heading';

export { headingVariants };
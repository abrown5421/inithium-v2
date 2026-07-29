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
  },
  defaultVariants: {
    level: 2,
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  /** Merge props onto the immediate child instead of rendering an element of your own. */
  asChild?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, asChild = false, ...props }, ref) => {
    const resolvedLevel = level ?? 2;
    const Comp = asChild ? Slot : ((`h${resolvedLevel}` as const) as React.ElementType);
    return (
      <Comp
        ref={ref}
        data-slot="heading"
        className={cn(headingVariants({ level: resolvedLevel }), className)}
        {...props}
      />
    );
  },
);
Heading.displayName = 'Heading';

export { headingVariants };

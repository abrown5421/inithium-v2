import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn.js';
import { resolveColorRecipeClassName } from '../theme/resolve-color-recipe.js';
import type { ColorToken } from '../theme/color-value.js';

export type BadgeVariant = 'solid' | 'outlined';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
  {
    variants: {
      variant: {
        solid: 'border-transparent',
        outlined: 'border',
      },
    },
    defaultVariants: {
      variant: 'solid',
    },
  },
);

const BADGE_NEUTRAL_OUTLINED =
  'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground';

function resolveBadgeColorClassName(variant: BadgeVariant, color?: ColorToken): string {
  if (variant === 'solid') return resolveColorRecipeClassName('solid', color ?? 'primary');
  return color ? resolveColorRecipeClassName('outlined', color) : BADGE_NEUTRAL_OUTLINED;
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof badgeVariants>, 'variant'> {
  variant?: BadgeVariant;
  /** One of the 8 core theme tokens. Defaults to `primary` for `solid`, otherwise renders a neutral treatment. */
  color?: ColorToken;
  asChild?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, color, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'span';
    const resolvedVariant = variant ?? 'solid';
    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(
          badgeVariants({ variant: resolvedVariant }),
          resolveBadgeColorClassName(resolvedVariant, color),
          className,
        )}
        {...props}
      />
    );
  },
);
Badge.displayName = 'Badge';

export { badgeVariants };

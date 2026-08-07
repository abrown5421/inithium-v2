import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn.js';
import { resolveColorRecipeClassName } from '../theme/resolve-color-recipe.js';
import type { ColorToken } from '../theme/color-value.js';

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** One of the 8 core theme tokens for the filled indicator. Defaults to `primary`. */
  color?: ColorToken;
}

export const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, color, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value ?? 0));
    return (
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        value={value}
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}
        {...props}
      >
        <ProgressPrimitive.Indicator asChild>
          <motion.div
            data-slot="progress-indicator"
            className={cn('h-full flex-1 rounded-full', resolveColorRecipeClassName('fill', color ?? 'primary'))}
            initial={false}
            animate={{ width: `${clamped}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

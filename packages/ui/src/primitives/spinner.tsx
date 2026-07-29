import * as React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn.js';

const spinnerVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      sm: 'size-4',
      default: 'size-5',
      lg: 'size-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label announced to assistive tech while the spinner is visible. */
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label = 'Loading', ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      data-slot="spinner"
      className={cn('inline-flex', className)}
      {...props}
    >
      <motion.span
        className={cn('flex', spinnerVariants({ size }))}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }}
      >
        <Loader2 className="size-full" aria-hidden="true" />
      </motion.span>
      <span className="sr-only">{label}</span>
    </span>
  ),
);
Spinner.displayName = 'Spinner';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const colorSwatchVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-sm border border-border shadow-xs',
  {
    variants: {
      size: {
        sm: 'size-5',
        md: 'size-6',
        lg: 'size-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface ColorSwatchProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof colorSwatchVariants> {
  /** Any valid CSS color — hex, oklch, `var(--token)`, etc. */
  color: string;
  /** Overlays a checkmark to indicate this is the active swatch in a grid. */
  selected?: boolean;
}

/**
 * A purely presentational color square — no click handling of its own, so
 * callers wrap it in whatever interactive element fits (a `<button>` in a
 * grid, a static preview next to an input, ...).
 */
export const ColorSwatch = React.forwardRef<HTMLSpanElement, ColorSwatchProps>(
  ({ color, selected, size, className, style, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="color-swatch"
      data-selected={selected || undefined}
      className={cn(colorSwatchVariants({ size }), className)}
      style={{ backgroundColor: color, ...style }}
      {...props}
    >
      {selected ? (
        <Check
          className="size-3 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]"
          aria-hidden="true"
        />
      ) : null}
    </span>
  ),
);
ColorSwatch.displayName = 'ColorSwatch';

export { colorSwatchVariants };

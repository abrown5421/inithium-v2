import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../utils/cn.js';
import { resolveColorRecipeClassName } from '../theme/resolve-color-recipe.js';
import type { ColorToken } from '../theme/color-value.js';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** One of the 8 core theme tokens for the filled track/thumb. Defaults to `primary`. */
  color?: ColorToken;
}

export const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, defaultValue, value, min = 0, max = 100, color, ...props }, ref) => {
    const values = React.useMemo(
      () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
      [value, defaultValue, min],
    );
    const resolvedColor = color ?? 'primary';

    return (
      <SliderPrimitive.Root
        ref={ref}
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn(
          'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              'absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
              resolveColorRecipeClassName('fill', resolvedColor),
            )}
          />
        </SliderPrimitive.Track>
        {values.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            data-slot="slider-thumb"
            className={cn(
              'block size-4 shrink-0 rounded-full border bg-background shadow-sm outline-none transition-[color,box-shadow] hover:ring-4 hover:ring-ring/20 focus-visible:ring-4 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
              resolveColorRecipeClassName('border', resolvedColor),
            )}
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

import * as React from 'react';
import { cn } from '../utils/cn.js';
import { resolveColorRecipeClassName } from '../theme/resolve-color-recipe.js';
import type { ColorToken } from '../theme/color-value.js';

const ALERT_BASE_CLASSES =
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current";

const ALERT_NEUTRAL_CLASSES = 'border-border bg-card text-card-foreground';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** One of the 8 core theme tokens. Omit for the neutral (card-surface) treatment. */
  color?: ColorToken;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, color, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      className={cn(
        ALERT_BASE_CLASSES,
        color ? resolveColorRecipeClassName('soft', color) : ALERT_NEUTRAL_CLASSES,
        className,
      )}
      {...props}
    />
  ),
);
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm text-current/80 [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  ),
);
AlertDescription.displayName = 'AlertDescription';

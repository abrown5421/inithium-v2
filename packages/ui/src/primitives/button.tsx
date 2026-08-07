import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn.js';
import { resolveColorRecipeClassName } from '../theme/resolve-color-recipe.js';
import type { ColorToken } from '../theme/color-value.js';

export type ButtonVariant = 'solid' | 'outlined' | 'ghost' | 'link';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  {
    variants: {
      variant: {
        solid: 'shadow-xs',
        outlined: 'border bg-background shadow-xs',
        ghost: '',
        link: 'underline-offset-4',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'default',
    },
  },
);

/** Applied when `color` is omitted on a variant that has a legitimate neutral (colorless) state. */
const BUTTON_NEUTRAL_CLASSES: Record<Exclude<ButtonVariant, 'solid'>, string> = {
  outlined: 'border-border hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-foreground hover:text-accent hover:underline',
};

function resolveButtonColorClassName(variant: ButtonVariant, color?: ColorToken): string {
  if (variant === 'solid') return resolveColorRecipeClassName('solid', color ?? 'primary');
  if (!color) return BUTTON_NEUTRAL_CLASSES[variant];
  return resolveColorRecipeClassName(variant, color);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, 'variant'> {
  variant?: ButtonVariant;
  /** One of the 8 core theme tokens. Defaults to `primary` for `solid`, otherwise renders a neutral treatment. */
  color?: ColorToken;
  /** Merge props onto the immediate child instead of rendering a `<button>`. */
  asChild?: boolean;
  /** Shows a spinner in place of `leftIcon` and disables the button. */
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/** Resolves a complete Button class string (structural + color) without rendering `<Button>` itself. */
export function getButtonClassName(options: {
  variant?: ButtonVariant;
  size?: VariantProps<typeof buttonVariants>['size'];
  color?: ColorToken;
  className?: string;
}): string {
  const variant = options.variant ?? 'solid';
  return cn(
    buttonVariants({ variant, size: options.size }),
    resolveButtonColorClassName(variant, options.color),
    options.className,
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      color,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    // Slot requires a single React element child, so icon/spinner injection
    // only applies when we own the rendered element.
    const content = asChild ? (
      children
    ) : (
      <>
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : leftIcon}
        {children}
        {!loading ? rightIcon : null}
      </>
    );

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-loading={loading || undefined}
        className={getButtonClassName({ variant, size, color, className })}
        disabled={asChild ? undefined : disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };

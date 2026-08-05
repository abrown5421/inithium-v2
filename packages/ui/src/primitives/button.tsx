import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn.js';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer',
        destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 cursor-pointer',
        outline:
          'border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground cursor-pointer',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 cursor-pointer',
        ghost: 'hover:bg-accent hover:text-accent-foreground cursor-pointer',
        link: 'text-foreground underline-offset-4 hover:underline hover:text-accent cursor-pointer',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Merge props onto the immediate child instead of rendering a `<button>`. */
  asChild?: boolean;
  /** Shows a spinner in place of `leftIcon` and disables the button. */
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
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
        className={cn(buttonVariants({ variant, size }), className)}
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

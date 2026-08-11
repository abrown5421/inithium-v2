import * as React from 'react';
import { cn } from '../utils/cn.js';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Marks the field as invalid and switches it to the destructive palette. */
  error?: boolean | string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, 'aria-invalid': ariaInvalid, ...props }, ref) => (
    <textarea
      ref={ref}
      data-slot="textarea"
      aria-invalid={ariaInvalid ?? Boolean(error)}
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

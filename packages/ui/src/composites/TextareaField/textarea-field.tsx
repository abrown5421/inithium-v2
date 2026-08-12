import * as React from 'react';
import { Textarea, TextareaProps } from '../../primitives/textarea.js';
import { Label } from '../../primitives/label.js';
import { Text } from '../../primitives/text.js';
import { cn } from '../../utils/cn.js';

export interface TextareaFieldProps extends TextareaProps {
  readonly label: string;
  readonly errorMessage?: string;
  readonly containerClassName?: string;
}

export const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, errorMessage, containerClassName, id, required, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
        <Textarea
          ref={ref}
          id={inputId}
          required={required}
          error={Boolean(errorMessage)}
          aria-describedby={errorMessage ? helperId : undefined}
          {...props}
        />
        {errorMessage ? (
          <Text as="span" id={helperId} size="xs" color="destructive">
            {errorMessage}
          </Text>
        ) : null}
      </div>
    );
  }
);
TextareaField.displayName = 'TextareaField';

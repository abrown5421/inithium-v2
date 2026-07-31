import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../primitives/button.js';
import { Input, InputProps } from '../../primitives/input.js';
import { Label } from '../../primitives/label.js';
import { Text } from '../../primitives/text.js';
import { cn } from '../../utils/cn.js';

export interface PasswordFieldProps extends Omit<InputProps, 'type'> {
  readonly label: string;
  readonly errorMessage?: string;
  readonly containerClassName?: string;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, errorMessage, containerClassName, id, required, className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            required={required}
            error={Boolean(errorMessage)}
            aria-describedby={errorMessage ? helperId : undefined}
            className={cn('pr-9', className)}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 size-9 text-muted-foreground hover:text-foreground"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
        {errorMessage ? (
          <Text as="span" id={helperId} size="xs" tone="destructive">
            {errorMessage}
          </Text>
        ) : null}
      </div>
    );
  }
);
PasswordField.displayName = 'PasswordField';

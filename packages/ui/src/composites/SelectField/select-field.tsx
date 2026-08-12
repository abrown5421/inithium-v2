import * as React from 'react';
import { Label } from '../../primitives/label.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../primitives/select.js';
import { Text } from '../../primitives/text.js';
import { cn } from '../../utils/cn.js';

export interface SelectFieldOption {
  readonly value: string;
  readonly label: string;
}

export interface SelectFieldProps {
  readonly label: string;
  readonly value?: string;
  readonly onValueChange: (value: string) => void;
  readonly options: readonly SelectFieldOption[];
  readonly errorMessage?: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly containerClassName?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onValueChange,
  options,
  errorMessage,
  placeholder,
  required,
  disabled,
  containerClassName
}) => {
  const generatedId = React.useId();
  const helperId = `${generatedId}-helper`;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <Label htmlFor={generatedId} required={required}>
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={generatedId}
          error={Boolean(errorMessage)}
          aria-describedby={errorMessage ? helperId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errorMessage ? (
        <Text as="span" id={helperId} size="xs" color="destructive">
          {errorMessage}
        </Text>
      ) : null}
    </div>
  );
};

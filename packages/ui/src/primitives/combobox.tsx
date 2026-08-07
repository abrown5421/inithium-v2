import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../utils/cn.js';
import { Button } from './button.js';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command.js';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  error?: boolean | string;
  triggerClassName?: string;
  contentClassName?: string;
}

/** A single-select searchable dropdown built from Popover + Command. */
export function Combobox({
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = 'Select an option…',
  searchPlaceholder = 'Search…',
  emptyText = 'No results found.',
  disabled,
  error,
  triggerClassName,
  contentClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '');
  const value = controlledValue ?? uncontrolledValue;
  const selected = options.find((option) => option.value === value);

  const handleSelect = (nextValue: string) => {
    const resolved = nextValue === value ? '' : nextValue;
    if (controlledValue === undefined) {
      setUncontrolledValue(resolved);
    }
    onValueChange?.(resolved);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outlined"
          role="combobox"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          disabled={disabled}
          className={cn(
            'w-full justify-between font-normal',
            !selected && 'text-muted-foreground',
            'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
            triggerClassName,
          )}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-(--radix-popover-trigger-width) p-0', contentClassName)}
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

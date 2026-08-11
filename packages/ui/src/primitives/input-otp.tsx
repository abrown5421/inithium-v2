import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { Minus } from 'lucide-react';
import { cn } from '../utils/cn.js';

export type InputOTPProps = React.ComponentPropsWithoutRef<typeof OTPInput> & {
  containerClassName?: string;
};

export const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, InputOTPProps>(
  ({ className, containerClassName, maxLength = 6, ...props }, ref) => (
    <OTPInput
      ref={ref}
      maxLength={maxLength}
      data-slot="input-otp"
      containerClassName={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        containerClassName,
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  ),
);
InputOTP.displayName = 'InputOTP';

export const InputOTPGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="input-otp-group" className={cn('flex items-center', className)} {...props} />
  ),
);
InputOTPGroup.displayName = 'InputOTPGroup';

export interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

export const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const slot = inputOTPContext?.slots[index];
    const char = slot?.char;
    const hasFakeCaret = slot?.hasFakeCaret;
    const isActive = slot?.isActive;

    return (
      <div
        ref={ref}
        data-slot="input-otp-slot"
        data-active={isActive || undefined}
        className={cn(
          'relative flex size-9 items-center justify-center border-y border-r border-input text-sm text-foreground shadow-xs outline-none transition-all first:rounded-l-md first:border-l last:rounded-r-md',
          'data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-2 data-[active=true]:ring-ring/50',
          className,
        )}
        {...props}
      >
        {char}
        {hasFakeCaret ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
          </div>
        ) : null}
      </div>
    );
  },
);
InputOTPSlot.displayName = 'InputOTPSlot';

export const InputOTPSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => (
    <div ref={ref} data-slot="input-otp-separator" role="separator" {...props}>
      <Minus className="size-4" />
    </div>
  ),
);
InputOTPSeparator.displayName = 'InputOTPSeparator';
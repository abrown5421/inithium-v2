import * as React from 'react';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { AlertSeverity, AnimationConfig } from '@inithium/types';
import { AlertDescription, AlertTitle } from '../../primitives/alert.js';
import { cn } from '../../utils/cn.js';
import { playEntranceAnimation, playExitAnimation } from './animate-orchestrator.js';

// Floats over arbitrary page content (unlike the inline `Alert` primitive, which
// assumes it's already sitting on a solid page surface), so the fill has to stay
// fully opaque — color-mix against the opaque popover surface keeps it a light
// tint of the severity color instead of a translucent wash that shows through.
const alertToastVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm shadow-lg has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'border-border bg-popover text-popover-foreground',
        destructive:
          'border-destructive/50 bg-[color-mix(in_oklab,var(--color-destructive)_12%,var(--color-popover))] text-destructive [&>svg]:text-destructive',
        success:
          'border-success/50 bg-[color-mix(in_oklab,var(--color-success)_12%,var(--color-popover))] text-success [&>svg]:text-success',
        warning:
          'border-warning/50 bg-[color-mix(in_oklab,var(--color-warning)_12%,var(--color-popover))] text-warning [&>svg]:text-warning',
        info: 'border-info/50 bg-[color-mix(in_oklab,var(--color-info)_12%,var(--color-popover))] text-info [&>svg]:text-info'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface AlertToastItemProps {
  readonly id: string;
  readonly message: string;
  readonly title?: string;
  readonly severity?: AlertSeverity;
  readonly closeable: boolean;
  readonly autoCloseMs: number | null;
  readonly animation: AnimationConfig;
  readonly onClose: (id: string) => void;
}

export const AlertToastItem: React.FC<AlertToastItemProps> = ({
  id,
  message,
  title,
  severity,
  closeable,
  autoCloseMs,
  animation,
  onClose
}) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const closingRef = React.useRef(false);

  const close = React.useCallback(() => {
    if (closingRef.current) {
      return;
    }
    closingRef.current = true;

    const node = nodeRef.current;
    if (!node) {
      onClose(id);
      return;
    }
    void playExitAnimation(node, animation.exit ?? 'fadeOut', animation.duration).then(() => onClose(id));
  }, [animation.duration, animation.exit, id, onClose]);

  React.useEffect(() => {
    const node = nodeRef.current;
    if (!node) {
      return;
    }
    return playEntranceAnimation(node, animation.entry ?? 'fadeIn', animation.duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!autoCloseMs) {
      return;
    }
    const timer = window.setTimeout(close, autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [autoCloseMs, close]);

  return (
    <div
      ref={nodeRef}
      role="alert"
      data-slot="alert-toast"
      className={cn(alertToastVariants({ variant: severity ?? 'default' }), 'pointer-events-auto', closeable && 'pr-8')}
    >
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription>{message}</AlertDescription>
      {closeable ? (
        <button
          type="button"
          aria-label="Close alert"
          onClick={close}
          className="absolute top-2 right-2 rounded-md p-1 text-current/50 opacity-70 transition-opacity hover:text-current hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
};

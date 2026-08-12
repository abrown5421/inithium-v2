import * as React from 'react';
import type { PresenceStatus, PresenceStatusMeta } from '@inithium/presence';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../primitives/tooltip.js';
import { cn } from '../../utils/cn.js';

export type PresenceDotPlacement = 'bottom-right' | 'top-right';

const PLACEMENT_CLASSNAMES: Readonly<Record<PresenceDotPlacement, string>> = {
  'bottom-right': 'bottom-0 right-0',
  'top-right': 'top-0 right-0'
};

export interface PresenceDotProps {
  readonly status: PresenceStatus;
  readonly meta: Readonly<Record<PresenceStatus, PresenceStatusMeta>>;
  readonly placement?: PresenceDotPlacement;
  readonly className?: string;
}

export const PresenceDot: React.FC<PresenceDotProps> = ({ status, meta, placement = 'bottom-right', className }) => {
  const { label, dotClassName } = meta[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-label={label}
          className={cn(
            'absolute size-2.5 rounded-full ring-2 ring-background',
            PLACEMENT_CLASSNAMES[placement],
            dotClassName,
            className
          )}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

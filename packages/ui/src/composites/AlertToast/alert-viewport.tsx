import * as React from 'react';
import { ALERT_POSITIONS, type AlertPosition, type AlertSeverity, type AnimationConfig } from '@inithium/types';
import { cn } from '../../utils/cn.js';
import { AlertToastItem } from './alert-toast-item.js';

export interface AlertToastConfig {
  readonly id: string;
  readonly message: string;
  readonly title?: string;
  readonly severity?: AlertSeverity;
  readonly position: AlertPosition;
  readonly closeable: boolean;
  readonly autoCloseMs: number | null;
  readonly animation: AnimationConfig;
}

export interface AlertViewportProps {
  readonly alerts: readonly AlertToastConfig[];
  readonly onClose: (id: string) => void;
}

const POSITION_CLASSES: Record<AlertPosition, string> = {
  'top-left': 'top-0 left-0 items-start',
  'top-right': 'top-0 right-0 items-end',
  'bottom-left': 'bottom-0 left-0 items-start',
  'bottom-right': 'bottom-0 right-0 items-end'
};

export const AlertViewport: React.FC<AlertViewportProps> = ({ alerts, onClose }) => (
  <>
    {ALERT_POSITIONS.map((position) => {
      const positionAlerts = alerts.filter((alert) => alert.position === position);
      if (positionAlerts.length === 0) {
        return null;
      }

      // Newest alert nearest the viewport edge it's anchored to.
      const ordered = position.startsWith('top') ? [...positionAlerts].reverse() : positionAlerts;

      return (
        <div
          key={position}
          className={cn(
            'pointer-events-none fixed z-100 flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px]',
            POSITION_CLASSES[position]
          )}
        >
          {ordered.map((alert) => (
            <AlertToastItem key={alert.id} {...alert} onClose={onClose} />
          ))}
        </div>
      );
    })}
  </>
);

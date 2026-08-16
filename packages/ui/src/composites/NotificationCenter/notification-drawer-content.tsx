import * as React from 'react';
import { SheetContent, SheetHeader, SheetTitle } from '../../primitives/sheet.js';
import { cn } from '../../utils/cn.js';
import type { NotificationCenterItem } from './notification-center.types.js';

const RELATIVE_TIME_UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 1000 * 60 * 60 * 24 * 365],
  ['month', 1000 * 60 * 60 * 24 * 30],
  ['week', 1000 * 60 * 60 * 24 * 7],
  ['day', 1000 * 60 * 60 * 24],
  ['hour', 1000 * 60 * 60],
  ['minute', 1000 * 60],
];

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

const formatRelativeTime = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value);
  const diffMs = date.getTime() - Date.now();

  for (const [unit, unitMs] of RELATIVE_TIME_UNITS) {
    if (Math.abs(diffMs) >= unitMs) {
      return relativeTimeFormatter.format(Math.round(diffMs / unitMs), unit);
    }
  }
  return relativeTimeFormatter.format(0, 'minute');
};

export interface NotificationDrawerContentProps {
  readonly notifications: readonly NotificationCenterItem[];
  readonly isLoading: boolean;
  readonly onNotificationClick: (notification: NotificationCenterItem) => void;
}

export const NotificationDrawerContent: React.FC<NotificationDrawerContentProps> = ({
  notifications,
  isLoading,
  onNotificationClick,
}) => (
  <SheetContent side="right" className="w-full sm:max-w-sm">
    <SheetHeader>
      <SheetTitle>Notifications</SheetTitle>
    </SheetHeader>

    <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
      {isLoading ? (
        <p className="px-1 text-sm text-muted-foreground">Loading…</p>
      ) : notifications.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">You&apos;re all caught up.</p>
      ) : (
        notifications.map((notification) => (
          <button
            key={notification._id}
            type="button"
            onClick={() => onNotificationClick(notification)}
            className={cn(
              'flex flex-col items-start gap-1 rounded-md border border-transparent px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
              !notification.read && 'bg-muted/60',
            )}
          >
            <div className="flex w-full items-center gap-2">
              {!notification.read ? <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" /> : null}
              <span className="font-medium">{notification.title}</span>
            </div>
            <span className="text-muted-foreground">{notification.message}</span>
            <span className="text-xs text-muted-foreground">{formatRelativeTime(notification.createdAt)}</span>
          </button>
        ))
      )}
    </div>
  </SheetContent>
);

import * as React from 'react';
import { Sheet } from '../../primitives/sheet.js';
import { NotificationBell } from './notification-bell.js';
import { NotificationDrawerContent } from './notification-drawer-content.js';
import type { NotificationCenterItem } from './notification-center.types.js';

export interface NotificationCenterProps {
  readonly notifications: readonly NotificationCenterItem[];
  readonly unreadCount: number;
  readonly isLoading?: boolean;
  readonly onNotificationClick: (notification: NotificationCenterItem) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  unreadCount,
  isLoading = false,
  onNotificationClick,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <NotificationBell unreadCount={unreadCount} />
      <NotificationDrawerContent
        notifications={notifications}
        isLoading={isLoading}
        onNotificationClick={(notification) => {
          setOpen(false);
          onNotificationClick(notification);
        }}
      />
    </Sheet>
  );
};

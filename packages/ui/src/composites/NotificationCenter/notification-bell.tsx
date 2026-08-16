import * as React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../../primitives/button.js';
import { Badge } from '../../primitives/badge.js';
import { SheetTrigger } from '../../primitives/sheet.js';

export interface NotificationBellProps {
  readonly unreadCount: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount }) => (
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
      <Bell />
      {unreadCount > 0 ? (
        <Badge
          variant="solid"
          color="destructive"
          className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px] leading-none"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      ) : null}
    </Button>
  </SheetTrigger>
);

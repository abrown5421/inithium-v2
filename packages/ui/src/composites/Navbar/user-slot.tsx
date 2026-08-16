import * as React from 'react';
import { Menu } from 'lucide-react';
import type { PresenceStatus } from '@inithium/presence';
import { Button } from '../../primitives/button.js';
import { AvatarWithPresence } from '../Presence/avatar-with-presence.js';
import { NotificationCenter } from '../NotificationCenter/notification-center.js';
import type { NotificationCenterItem } from '../NotificationCenter/notification-center.types.js';
import { NavDrawer } from './nav-drawer.js';
import { NavbarLinkComponent, NavbarMenuItem, NavbarUser } from './navbar.types.js';

export interface UserSlotProps {
  readonly isAuthenticated: boolean;
  readonly user?: NavbarUser;
  readonly presenceStatus?: PresenceStatus;
  readonly mainMenuItems: readonly NavbarMenuItem[];
  readonly profileMenuItems: readonly NavbarMenuItem[];
  readonly onLoginClick?: () => void;
  readonly onLogoutClick?: () => void;
  readonly linkComponent?: NavbarLinkComponent;
  readonly notifications?: readonly NotificationCenterItem[];
  readonly unreadNotificationCount?: number;
  readonly isNotificationsLoading?: boolean;
  readonly onNotificationClick?: (notification: NotificationCenterItem) => void;
}

export const UserSlot: React.FC<UserSlotProps> = ({
  isAuthenticated,
  user,
  presenceStatus,
  mainMenuItems,
  profileMenuItems,
  onLoginClick,
  onLogoutClick,
  linkComponent,
  notifications,
  unreadNotificationCount,
  isNotificationsLoading,
  onNotificationClick
}) => (
  <div className="flex items-center">
    <div className="flex items-center gap-1 lg:hidden">
      {isAuthenticated ? (
        <>
          <NotificationCenter
            notifications={notifications ?? []}
            unreadCount={unreadNotificationCount ?? 0}
            isLoading={isNotificationsLoading}
            onNotificationClick={onNotificationClick ?? (() => undefined)}
          />
          <NavDrawer
            trigger={<AvatarWithPresence user={user} status={presenceStatus ?? 'offline'} />}
            triggerLabel="Account menu"
            sections={[{ items: mainMenuItems }, { items: profileMenuItems }]}
            footerAction={{ label: 'Log Out', onClick: onLogoutClick, color: 'destructive' }}
            linkComponent={linkComponent}
            userName={user?.firstName}
          />
        </>
      ) : (
        <NavDrawer
          trigger={<Menu />}
          triggerLabel="Menu"
          sections={[{ items: mainMenuItems }]}
          footerAction={{ label: 'Log In', onClick: onLoginClick, color: 'primary' }}
          linkComponent={linkComponent}
        />
      )}
    </div>

    <div className="hidden lg:flex lg:items-center lg:gap-1">
      {isAuthenticated ? (
        <>
          <NotificationCenter
            notifications={notifications ?? []}
            unreadCount={unreadNotificationCount ?? 0}
            isLoading={isNotificationsLoading}
            onNotificationClick={onNotificationClick ?? (() => undefined)}
          />
          <NavDrawer
            trigger={<AvatarWithPresence user={user} status={presenceStatus ?? 'offline'} />}
            triggerLabel="Account menu"
            sections={[{ items: profileMenuItems }]}
            footerAction={{ label: 'Log Out', onClick: onLogoutClick, color: 'destructive' }}
            linkComponent={linkComponent}
            userName={user?.firstName}
          />
        </>
      ) : (
        <Button onClick={onLoginClick}>Log In</Button>
      )}
    </div>
  </div>
);

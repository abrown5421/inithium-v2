import * as React from 'react';
import { Menu } from 'lucide-react';
import type { PresenceStatus } from '@inithium/presence';
import { Button } from '../../primitives/button.js';
import { AvatarWithPresence } from '../Presence/avatar-with-presence.js';
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
}

export const UserSlot: React.FC<UserSlotProps> = ({
  isAuthenticated,
  user,
  presenceStatus,
  mainMenuItems,
  profileMenuItems,
  onLoginClick,
  onLogoutClick,
  linkComponent
}) => (
  <div className="flex items-center">
    <div className="flex items-center lg:hidden">
      {isAuthenticated ? (
        <NavDrawer
          trigger={<AvatarWithPresence user={user} status={presenceStatus ?? 'offline'} />}
          triggerLabel="Account menu"
          sections={[{ items: mainMenuItems }, { items: profileMenuItems }]}
          footerAction={{ label: 'Log Out', onClick: onLogoutClick, color: 'destructive' }}
          linkComponent={linkComponent}
          userName={user?.firstName}
        />
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

    <div className="hidden lg:flex lg:items-center">
      {isAuthenticated ? (
        <NavDrawer
          trigger={<AvatarWithPresence user={user} status={presenceStatus ?? 'offline'} />}
          triggerLabel="Account menu"
          sections={[{ items: profileMenuItems }]}
          footerAction={{ label: 'Log Out', onClick: onLogoutClick, color: 'destructive' }}
          linkComponent={linkComponent}
          userName={user?.firstName}
        />
      ) : (
        <Button onClick={onLoginClick}>Log In</Button>
      )}
    </div>
  </div>
);

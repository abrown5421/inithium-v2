import * as React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../../primitives/button.js';
import { NavDrawer } from './nav-drawer.js';
import { NavbarLinkComponent, NavbarMenuItem, NavbarUser } from './navbar.types.js';
import { UserAvatar } from './user-avatar.js';

export interface UserSlotProps {
  readonly isAuthenticated: boolean;
  readonly user?: NavbarUser;
  readonly mainMenuItems: readonly NavbarMenuItem[];
  readonly profileMenuItems: readonly NavbarMenuItem[];
  readonly onLoginClick?: () => void;
  readonly onLogoutClick?: () => void;
  readonly linkComponent?: NavbarLinkComponent;
}

export const UserSlot: React.FC<UserSlotProps> = ({
  isAuthenticated,
  user,
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
          trigger={<UserAvatar user={user} />}
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
          trigger={<UserAvatar user={user} />}
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

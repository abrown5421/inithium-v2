import * as React from 'react';
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../primitives/avatar.js';
import { Button } from '../../primitives/button.js';
import { NavDrawer } from './nav-drawer.js';
import { NavbarLinkComponent, NavbarMenuItem, NavbarUser } from './navbar.types.js';

export interface UserSlotProps {
  readonly isAuthenticated: boolean;
  readonly user?: NavbarUser;
  readonly mainMenuItems: readonly NavbarMenuItem[];
  readonly profileMenuItems: readonly NavbarMenuItem[];
  readonly onLoginClick?: () => void;
  readonly onLogoutClick?: () => void;
  readonly linkComponent?: NavbarLinkComponent;
}

const UserAvatar: React.FC<{ readonly user?: NavbarUser }> = ({ user }) => (
  <Avatar>
    {user?.avatarSrc ? <AvatarImage src={user.avatarSrc} alt={user?.name ?? 'Account'} /> : null}
    <AvatarFallback>{user?.avatarFallback ?? user?.name?.charAt(0)?.toUpperCase() ?? '?'}</AvatarFallback>
  </Avatar>
);

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
          footerAction={{ label: 'Log Out', onClick: onLogoutClick, variant: 'destructive' }}
          linkComponent={linkComponent}
          userName={user?.firstName}
        />
      ) : (
        <NavDrawer
          trigger={<Menu />}
          triggerLabel="Menu"
          sections={[{ items: mainMenuItems }]}
          footerAction={{ label: 'Log In', onClick: onLoginClick, variant: 'default' }}
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
          footerAction={{ label: 'Log Out', onClick: onLogoutClick, variant: 'destructive' }}
          linkComponent={linkComponent}
          userName={user?.firstName}
        />
      ) : (
        <Button onClick={onLoginClick}>Log In</Button>
      )}
    </div>
  </div>
);

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { LogoSlot } from './logo-slot.js';
import { MenuSlot } from './menu-slot.js';
import { NavbarProps } from './navbar.types.js';
import { UserSlot } from './user-slot.js';

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  title,
  homeHref,
  onLogoClick,
  mainMenuItems,
  profileMenuItems,
  isAuthenticated,
  user,
  presenceStatus,
  onLoginClick,
  onLogoutClick,
  linkComponent,
  className
}) => (
  <header className={cn('flex items-center justify-between border-b border-border bg-background px-4 py-3', className)}>
    <LogoSlot
      logo={logo}
      title={title}
      homeHref={homeHref}
      onLogoClick={onLogoClick}
      linkComponent={linkComponent}
    />

    <div className="flex items-center gap-6">
      <MenuSlot items={mainMenuItems} linkComponent={linkComponent} />
      <UserSlot
        isAuthenticated={isAuthenticated}
        user={user}
        presenceStatus={presenceStatus}
        mainMenuItems={mainMenuItems}
        profileMenuItems={profileMenuItems}
        onLoginClick={onLoginClick}
        onLogoutClick={onLogoutClick}
        linkComponent={linkComponent}
      />
    </div>
  </header>
);

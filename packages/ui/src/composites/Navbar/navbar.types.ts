import * as React from 'react';

export interface NavbarLinkComponentProps {
  readonly href: string;
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly onClick?: () => void;
}

export type NavbarLinkComponent = React.ComponentType<NavbarLinkComponentProps>;

export interface NavbarMenuItem {
  readonly label: string;
  readonly href: string;
  readonly isButton?: boolean;
}

export interface NavbarLogo {
  readonly src: string;
  readonly alt?: string;
}

export interface NavbarUser {
  readonly name?: string;
  readonly firstName?: string;
  readonly avatarSrc?: string;
  readonly avatarFallback?: string;
}

export interface NavbarProps {
  readonly logo?: NavbarLogo;
  readonly title?: string;
  readonly homeHref?: string;
  readonly onLogoClick?: () => void;
  readonly mainMenuItems: readonly NavbarMenuItem[];
  readonly profileMenuItems: readonly NavbarMenuItem[];
  readonly isAuthenticated: boolean;
  readonly user?: NavbarUser;
  readonly onLoginClick?: () => void;
  readonly onLogoutClick?: () => void;
  readonly linkComponent?: NavbarLinkComponent;
  readonly className?: string;
}

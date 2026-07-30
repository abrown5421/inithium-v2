import * as React from 'react';
import { Button } from '../../primitives/button.js';
import { cn } from '../../utils/cn.js';
import { NavbarLinkComponent, NavbarMenuItem } from './navbar.types.js';

const DefaultLink: NavbarLinkComponent = ({ href, className, children, onClick }) => (
  <a href={href} className={className} onClick={onClick}>
    {children}
  </a>
);

export interface NavLinkProps {
  readonly item: NavbarMenuItem;
  readonly linkComponent?: NavbarLinkComponent;
  readonly fullWidth?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({ item, linkComponent, fullWidth = false }) => {
  const Link = linkComponent ?? DefaultLink;

  if (item.isButton) {
    return (
      <Button asChild size="sm" className={cn(fullWidth && 'w-full')}>
        <Link href={item.href}>{item.label}</Link>
      </Button>
    );
  }

  return (
    <Button asChild variant="ghost" size="sm" className={cn(fullWidth && 'w-full justify-start')}>
      <Link href={item.href}>{item.label}</Link>
    </Button>
  );
};

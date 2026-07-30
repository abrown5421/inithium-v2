import * as React from 'react';
import { NavbarLinkComponent, NavbarMenuItem } from './navbar.types.js';
import { NavLink } from './nav-link.js';

export interface MenuSlotProps {
  readonly items: readonly NavbarMenuItem[];
  readonly linkComponent?: NavbarLinkComponent;
}

export const MenuSlot: React.FC<MenuSlotProps> = ({ items, linkComponent }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
      {items.map((item) => (
        <NavLink key={item.label} item={item} linkComponent={linkComponent} />
      ))}
    </nav>
  );
};

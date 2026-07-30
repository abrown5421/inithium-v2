import { Link } from 'react-router-dom';
import { NavbarLinkComponent, NavbarMenuItem } from '@inithium/ui';
import { NavEntry, resolveNavHref } from './navigation-selection.js';

export const toNavbarMenuItem = ({ page, navigation }: NavEntry): NavbarMenuItem => ({
  label: navigation.label,
  href: resolveNavHref(page, navigation),
  isButton: navigation.isButton
});

export const RouterNavLink: NavbarLinkComponent = ({ href, className, children, onClick }) => (
  <Link to={href} className={className} onClick={onClick}>
    {children}
  </Link>
);

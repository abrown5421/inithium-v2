import * as React from 'react';
import { useHref } from 'react-router-dom';
import { NavbarLinkComponent, NavbarMenuItem } from '@inithium/ui';
import { usePageNavigate } from '../hooks/use-page-navigate.js';
import { MatchableLocation, resolvesToCurrentLocation } from './location-match.js';
import { NavEntry, resolveNavHref } from './navigation-selection.js';

export const toNavbarMenuItem = ({ page, navigation }: NavEntry, location: MatchableLocation): NavbarMenuItem => {
  const href = resolveNavHref(page, navigation);
  return {
    label: navigation.label,
    href,
    isButton: navigation.isButton,
    active: resolvesToCurrentLocation(href, location)
  };
};

const isModifiedClick = (event: React.MouseEvent): boolean =>
  event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

export const RouterNavLink: NavbarLinkComponent = ({ href, className, children, onClick }) => {
  const resolvedHref = useHref(href);
  const pageNavigate = usePageNavigate();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    onClick?.();
    if (isModifiedClick(event)) {
      return;
    }
    event.preventDefault();
    void pageNavigate(href);
  };

  return (
    <a href={resolvedHref} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};

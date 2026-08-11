import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { NavbarMenuItem } from '@inithium/ui';
import { NavEntry, NavHrefParams } from '../navigation/navigation-selection.js';
import { toNavbarMenuItem } from '../navigation/navigation-adapters.js';

const EMPTY_NAV_HREF_PARAMS: NavHrefParams = {};

export const useNavbarMenuItems = (
  entries: readonly NavEntry[],
  params: NavHrefParams = EMPTY_NAV_HREF_PARAMS
): readonly NavbarMenuItem[] => {
  const location = useLocation();

  return React.useMemo(
    () => entries.map((entry) => toNavbarMenuItem(entry, location, params)),
    [entries, location.pathname, location.search, params]
  );
};

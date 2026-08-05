import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { NavbarMenuItem } from '@inithium/ui';
import { NavEntry } from '../navigation/navigation-selection.js';
import { toNavbarMenuItem } from '../navigation/navigation-adapters.js';

export const useNavbarMenuItems = (entries: readonly NavEntry[]): readonly NavbarMenuItem[] => {
  const location = useLocation();

  return React.useMemo(
    () => entries.map((entry) => toNavbarMenuItem(entry, location)),
    [entries, location.pathname, location.search]
  );
};

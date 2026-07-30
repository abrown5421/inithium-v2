import * as React from 'react';
import { Page } from '@inithium/models';
import { NavLocation } from '@inithium/types';
import { AccessEvaluationConfig } from '../access-control/access-control.js';
import { NavEntry, selectNavEntriesForLocation } from '../navigation/navigation-selection.js';
import { usePageSession } from '../session/page-session-context.js';

export const useNavEntries = (
  pages: readonly Page[],
  app: string,
  location: NavLocation,
  config: AccessEvaluationConfig
): readonly NavEntry[] => {
  const session = usePageSession();

  return React.useMemo(
    () => selectNavEntriesForLocation(pages, app, location, session, config),
    [pages, app, location, session, config]
  );
};

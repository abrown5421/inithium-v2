import { Page, PageNavigation } from '@inithium/models';
import { NavLocation } from '@inithium/types';
import { AccessEvaluationConfig, evaluateAccess } from '../access-control/access-control.js';
import { PageSession } from '../session/session.types.js';
import { selectActivePagesForApp } from '../route-selection/route-selection.js';

export interface NavEntry {
  readonly page: Page;
  readonly navigation: PageNavigation;
}

export const resolveNavHref = (page: Page, navigation: PageNavigation): string =>
  navigation.resolveNavPath ?? page.route;

export const selectNavEntriesForLocation = (
  pages: readonly Page[],
  app: string,
  location: NavLocation,
  session: PageSession,
  config: AccessEvaluationConfig
): readonly NavEntry[] =>
  selectActivePagesForApp(pages, app)
    .flatMap((page) =>
      (page.navigation ?? [])
        .filter((navigation) => navigation.location === location)
        .map((navigation) => ({ page, navigation }))
    )
    .filter(({ page }) => evaluateAccess(page, session, config).kind === 'allow')
    .sort((a, b) => (a.navigation.order ?? 0) - (b.navigation.order ?? 0));

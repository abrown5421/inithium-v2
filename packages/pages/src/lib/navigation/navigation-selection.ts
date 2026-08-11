import { Page, PageNavigation } from '@inithium/models';
import { NavLocation } from '@inithium/types';
import { AccessEvaluationConfig, evaluateAccess } from '../access-control/access-control.js';
import { PageSession } from '../session/session.types.js';
import { selectActivePagesForApp } from '../route-selection/route-selection.js';

export interface NavEntry {
  readonly page: Page;
  readonly navigation: PageNavigation;
}

/** Values keyed by route param name (e.g. `{ id: authUserId }` for a `:id` segment). */
export type NavHrefParams = Readonly<Record<string, string | undefined>>;

const ROUTE_PARAM_PATTERN = /:([A-Za-z_][A-Za-z0-9_]*)/g;

/** Substitutes `:param` segments in a route pattern with values from `params`, leaving unresolved segments as-is. */
export const resolveRouteParams = (route: string, params: NavHrefParams): string =>
  route.replace(ROUTE_PARAM_PATTERN, (token, paramName: string) => params[paramName] ?? token);

export const resolveNavHref = (page: Page, navigation: PageNavigation, params: NavHrefParams = {}): string =>
  resolveRouteParams(navigation.resolveNavPath ?? page.route, params);

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

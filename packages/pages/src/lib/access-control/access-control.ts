import { Page } from '@inithium/models';
import { UserRole } from '@inithium/types';
import { PageSession } from '../session/session.types.js';

export type AccessDecision =
  | { readonly kind: 'allow' }
  | { readonly kind: 'not-found' }
  | { readonly kind: 'forbidden' }
  | { readonly kind: 'redirect'; readonly to: string };

export interface AccessEvaluationConfig {
  readonly loginRoute: string;
  readonly defaultAuthenticatedRoute: string;
  readonly onRoleMismatch?: 'not-found' | 'forbidden';
  /** When set, an authenticated session with `mustChangePassword` is redirected here from every other route. */
  readonly forcePasswordChangeRoute?: string;
}

export const isRoleAllowed = (role: UserRole | undefined, allowedRoles: readonly UserRole[]): boolean => {
  if (allowedRoles.length === 0) {
    return true;
  }
  return role !== undefined && allowedRoles.includes(role);
};

export const evaluateAccess = (page: Page, session: PageSession, config: AccessEvaluationConfig): AccessDecision => {
  if (!page.flags.isActive) {
    return { kind: 'not-found' };
  }

  if (page.accessControl.authenticated && !session.isAuthenticated) {
    return { kind: 'redirect', to: config.loginRoute };
  }

  if (
    config.forcePasswordChangeRoute &&
    session.mustChangePassword &&
    page.route !== config.forcePasswordChangeRoute
  ) {
    return { kind: 'redirect', to: config.forcePasswordChangeRoute };
  }

  if (page.accessControl.anonymousOnly && session.isAuthenticated) {
    return { kind: 'redirect', to: config.defaultAuthenticatedRoute };
  }

  if (!isRoleAllowed(session.role, page.accessControl.roles)) {
    return { kind: config.onRoleMismatch === 'forbidden' ? 'forbidden' : 'not-found' };
  }

  return { kind: 'allow' };
};

import { UserRole } from '@inithium/types';

export interface PageSession {
  readonly isAuthenticated: boolean;
  readonly role?: UserRole;
}

export const ANONYMOUS_SESSION: PageSession = { isAuthenticated: false };

import { UserRole } from '@inithium/types';

export interface PageSession {
  readonly isAuthenticated: boolean;
  readonly role?: UserRole;
  readonly mustChangePassword?: boolean;
}

export const ANONYMOUS_SESSION: PageSession = { isAuthenticated: false };

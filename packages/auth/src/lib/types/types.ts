import { UserRole } from '@inithium/types';

export interface JwtPayload {
  readonly sub: string;
  readonly email: string;
  readonly role: UserRole;
}

export interface AuthenticatedRequestUser {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
}

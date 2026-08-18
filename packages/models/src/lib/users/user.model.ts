import { BaseEntity, UserRole } from '@inithium/types';

export interface User extends BaseEntity {
  readonly email: string;
  readonly password: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly role: UserRole;
  /** True when the account still holds a password it didn't choose itself (e.g. a seeded default). Cleared by `changePassword`. */
  readonly mustChangePassword: boolean;
}

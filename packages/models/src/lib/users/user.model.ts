import { BaseEntity, UserRole } from '@inithium/types';

export interface User extends BaseEntity {
  readonly email: string;
  readonly password: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly role: UserRole;
}

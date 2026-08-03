export interface UserFormValues {
  readonly [key: string]: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
}

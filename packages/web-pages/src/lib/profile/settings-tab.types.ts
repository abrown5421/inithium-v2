export interface EmailFormErrors {
  readonly email?: string;
}

export interface PasswordFormErrors {
  readonly currentPassword?: string;
  readonly newPassword?: string;
  readonly confirmPassword?: string;
}

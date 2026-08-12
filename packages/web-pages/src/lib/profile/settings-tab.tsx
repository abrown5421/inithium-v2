import React from 'react';
import { AuthField, Badge, Button, Card, CardContent, CardHeader, CardTitle, PasswordField } from '@inithium/ui';
import { changePasswordSchema, updateSelfSchema, verifyPasswordSchema } from '@inithium/validators';
import {
  openAlert,
  useAppDispatch,
  useChangePasswordMutation,
  useMeQuery,
  useUpdateSelfMutation,
  useVerifyPasswordMutation
} from '@inithium/store';
import { buildFieldErrorMap } from './form-errors.js';
import { EmailFormErrors, PasswordFormErrors } from './settings-tab.types.js';
import type { ProfileTabContext } from './profile-tab-registry.js';

const VALIDATION_ERROR_MESSAGE = 'There were errors in your form';

export const SettingsTab: React.FC<{ readonly context: ProfileTabContext }> = () => {
  const dispatch = useAppDispatch();
  const { data: currentUser } = useMeQuery();

  const [email, setEmail] = React.useState('');
  const [emailErrors, setEmailErrors] = React.useState<EmailFormErrors>({});
  const [updateSelf, { isLoading: isSavingEmail }] = useUpdateSelfMutation();

  React.useEffect(() => {
    if (currentUser) setEmail(currentUser.email);
  }, [currentUser]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const result = updateSelfSchema.safeParse({ email });
    if (!result.success) {
      setEmailErrors(buildFieldErrorMap(result.error));
      dispatch(openAlert({ severity: 'destructive', message: VALIDATION_ERROR_MESSAGE }));
      return;
    }
    setEmailErrors({});
    try {
      await updateSelf(result.data).unwrap();
      dispatch(openAlert({ severity: 'success', message: 'Email updated' }));
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: 'Failed to update email' }));
    }
  };

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordErrors, setPasswordErrors] = React.useState<PasswordFormErrors>({});
  const [verifyPassword, { isLoading: isVerifying }] = useVerifyPasswordMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const resetPasswordForm = (): void => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsCurrentPasswordVerified(false);
    setPasswordErrors({});
  };

  const handleVerifyPassword = async (): Promise<void> => {
    const result = verifyPasswordSchema.safeParse({ currentPassword });
    if (!result.success) {
      setPasswordErrors(buildFieldErrorMap(result.error));
      dispatch(openAlert({ severity: 'destructive', message: VALIDATION_ERROR_MESSAGE }));
      return;
    }
    setPasswordErrors({});
    try {
      await verifyPassword(result.data).unwrap();
      setIsCurrentPasswordVerified(true);
    } catch {
      setPasswordErrors({ currentPassword: 'Current password is incorrect' });
      dispatch(openAlert({ severity: 'destructive', message: 'Current password is incorrect' }));
    }
  };

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const result = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!result.success) {
      setPasswordErrors(buildFieldErrorMap(result.error));
      dispatch(openAlert({ severity: 'destructive', message: VALIDATION_ERROR_MESSAGE }));
      return;
    }
    setPasswordErrors({});
    try {
      await changePassword(result.data).unwrap();
      dispatch(openAlert({ severity: 'success', message: 'Password updated' }));
      resetPasswordForm();
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: 'Failed to update password' }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleEmailSubmit} noValidate>
            <AuthField
              label="Email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              errorMessage={emailErrors.email}
            />
            <Button type="submit" loading={isSavingEmail} className="self-start">
              Save Email
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleChangePassword} noValidate>
            <PasswordField
              label="Current Password"
              autoComplete="current-password"
              required
              disabled={isCurrentPasswordVerified}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              errorMessage={passwordErrors.currentPassword}
            />

            {isCurrentPasswordVerified ? (
              <div className="flex items-center gap-2">
                <Badge color="success">Verified</Badge>
                <Button type="button" variant="ghost" size="sm" onClick={resetPasswordForm}>
                  Use a different password
                </Button>
              </div>
            ) : (
              <Button type="button" loading={isVerifying} onClick={handleVerifyPassword} className="self-start">
                Verify
              </Button>
            )}

            {isCurrentPasswordVerified ? (
              <>
                <PasswordField
                  label="New Password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  errorMessage={passwordErrors.newPassword}
                />
                <PasswordField
                  label="Confirm New Password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  errorMessage={passwordErrors.confirmPassword}
                />
                <Button type="submit" loading={isChangingPassword} className="self-start">
                  Update Password
                </Button>
              </>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

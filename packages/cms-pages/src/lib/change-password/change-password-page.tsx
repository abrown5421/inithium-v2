import * as React from 'react';
import { z } from 'zod';
import { PageLayoutComponent, usePageNavigate } from '@inithium/pages';
import { Button, Heading, PasswordField, Text } from '@inithium/ui';
import { changePasswordSchema } from '@inithium/validators';
import { openAlert, useAppDispatch, useChangePasswordMutation, useMeQuery } from '@inithium/store';
import { ChangePasswordFormErrors } from './change-password-page.types.js';

const VALIDATION_ERROR_MESSAGE = 'There were errors in your form';

export const ChangePasswordPage: PageLayoutComponent = () => {
  const navigate = usePageNavigate();
  const dispatch = useAppDispatch();
  const { data: currentUser } = useMeQuery();
  const isForced = Boolean(currentUser?.mustChangePassword);

  // Once the forced flag actually clears server-side (confirmed by the `me` refetch this
  // mutation's `invalidatesTags: ['Session']` triggers), send the user on to the dashboard.
  // Navigating here — rather than immediately after the mutation resolves — avoids racing
  // the guard in apps/cms/src/app/app.tsx, which reads the same still-stale flag until then.
  const wasForced = React.useRef(isForced);
  React.useEffect(() => {
    if (wasForced.current && !isForced) {
      void navigate('/');
    }
    wasForced.current = isForced;
  }, [isForced, navigate]);

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errors, setErrors] = React.useState<ChangePasswordFormErrors>({});
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const result = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors({
        currentPassword: fieldErrors.currentPassword?.[0],
        newPassword: fieldErrors.newPassword?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0]
      });
      dispatch(openAlert({ severity: 'destructive', message: VALIDATION_ERROR_MESSAGE }));
      return;
    }

    setErrors({});
    try {
      await changePassword(result.data).unwrap();
      dispatch(openAlert({ severity: 'success', message: 'Password updated' }));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setErrors({ currentPassword: 'Current password is incorrect' });
      dispatch(openAlert({ severity: 'destructive', message: 'Current password is incorrect' }));
    }
  };

  return (
    <div className="mx-auto flex w-full flex-1 flex-col items-center justify-center gap-6">
      <Heading font='secondary' level={1} className="text-center text-background">
        Change Password
      </Heading>

      {isForced ? (
        <Text className="max-w-[90%] text-center md:max-w-md" color="destructive">
          This account is still using its initial password. You must set a new password before you can access the
          CMS dashboard.
        </Text>
      ) : null}

      <form
        className="bg-background p-8 rounded-md flex w-full flex-col gap-4 max-w-[90%] md:max-w-md"
        onSubmit={handleSubmit}
        noValidate
      >
        <PasswordField
          label="Current Password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          errorMessage={errors.currentPassword}
        />
        <PasswordField
          label="New Password"
          autoComplete="new-password"
          required
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          errorMessage={errors.newPassword}
        />
        <PasswordField
          label="Confirm New Password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          errorMessage={errors.confirmPassword}
        />
        <Button type="submit" loading={isLoading} className="mt-2">
          Update Password
        </Button>
      </form>
    </div>
  );
};

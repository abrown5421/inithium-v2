import * as React from 'react';
import { z } from 'zod';
import { PageLayoutComponent, usePageNavigate } from '@inithium/pages';
import { AuthField, Button, Heading, PasswordField } from '@inithium/ui';
import { loginSchema } from '@inithium/validators';
import { openAlert, useAppDispatch, useLoginMutation, useLogoutMutation } from '@inithium/store';
import { LoginFormErrors } from './login-page.types.js';

const SUBMISSION_ERROR_MESSAGE = 'There was a problem with your submission';
const FORBIDDEN_ROLE_MESSAGE = "You don't have permission to access the CMS.";
export const CMS_ALLOWED_ROLES = new Set(['super-admin', 'admin', 'editor', 'writer']);

export const LoginPage: PageLayoutComponent = () => {
  const navigate = usePageNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [logout] = useLogoutMutation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<LoginFormErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors({ email: fieldErrors.email?.[0], password: fieldErrors.password?.[0] });
      dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
      return;
    }

    setErrors({});
    try {
      const user = await login(result.data).unwrap();
      if (!CMS_ALLOWED_ROLES.has(user.role)) {
        await logout();
        dispatch(openAlert({ severity: 'destructive', message: FORBIDDEN_ROLE_MESSAGE }));
        return;
      }
      await navigate('/');
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
    }
  };

  return (
    <div className="mx-auto flex w-full flex-1 flex-col items-center justify-center gap-6">
      <Heading font='secondary' level={1} className="text-center text-background">
        Log In
      </Heading>

      <form className="bg-background p-8 rounded-md flex w-full flex-col gap-4 max-w-[90%] md:max-w-md" onSubmit={handleSubmit} noValidate>
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          errorMessage={errors.email}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          errorMessage={errors.password}
        />
        <Button type="submit" loading={isLoading} className="mt-2">
          Log In
        </Button>
      </form>
    </div>
  );
};

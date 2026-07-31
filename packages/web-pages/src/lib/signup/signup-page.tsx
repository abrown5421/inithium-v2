import * as React from 'react';
import { z } from 'zod';
import { PageLayoutComponent, usePageNavigate } from '@inithium/pages';
import { AuthField, Button, Heading, PasswordField, Text } from '@inithium/ui';
import { openAlert, useAppDispatch, useRegisterMutation } from '@inithium/store';
import { signupSchema } from './signup-schema.js';
import { SignupFormErrors } from './signup-page.types.js';

const SUBMISSION_ERROR_MESSAGE = 'There was a problem with your submission';

export const SignupPage: PageLayoutComponent = () => {
  const navigate = usePageNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errors, setErrors] = React.useState<SignupFormErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = signupSchema.safeParse({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm_password: confirmPassword
    });

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors({
        first_name: fieldErrors.first_name?.[0],
        last_name: fieldErrors.last_name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirm_password: fieldErrors.confirm_password?.[0]
      });
      dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
      return;
    }

    setErrors({});
    const { confirm_password, last_name, ...rest } = result.data;
    try {
      await register({ ...rest, last_name: last_name ?? '' }).unwrap();
      await navigate('/');
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6">
      <Heading level={1} className="text-center">
        Sign Up
      </Heading>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <AuthField
          label="First Name"
          autoComplete="given-name"
          required
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          errorMessage={errors.first_name}
        />
        <AuthField
          label="Last Name"
          autoComplete="family-name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          errorMessage={errors.last_name}
        />
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          errorMessage={errors.password}
        />
        <PasswordField
          label="Confirm Password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          errorMessage={errors.confirm_password}
        />
        <Button type="submit" loading={isLoading} className="mt-2">
          Sign Up
        </Button>
      </form>

      <Text size="sm" tone="muted" className="text-center">
        {'Already have an account? '}
        <Button type="button" variant="link" className="h-auto p-0" onClick={() => navigate('/login')}>
          Log In
        </Button>
      </Text>
    </div>
  );
};

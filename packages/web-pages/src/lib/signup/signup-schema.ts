import { z } from 'zod';
import { registerSchema } from '@inithium/validators';

/**
 * Extends the shared `registerSchema` for form-level concerns: the last name
 * is optional in the UI (unlike the base schema) and a confirm-password field
 * is added purely for client-side match validation.
 */
export const signupSchema = registerSchema
  .extend({
    last_name: z.string().optional(),
    confirm_password: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password']
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

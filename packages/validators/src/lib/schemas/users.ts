import { z } from 'zod';
import { USER_ROLES } from '@inithium/types';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  role: z.enum(USER_ROLES).default('user')
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  role: z.enum(USER_ROLES).optional()
});

export const registerSchema = createUserSchema.omit({ role: true });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const updateSelfSchema = z.object({
  email: z.string().email().optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional()
});

export const verifyPasswordSchema = z.object({
  currentPassword: z.string().min(1)
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type UpdateSelfDTO = z.infer<typeof updateSelfSchema>;
export type VerifyPasswordDTO = z.infer<typeof verifyPasswordSchema>;
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;

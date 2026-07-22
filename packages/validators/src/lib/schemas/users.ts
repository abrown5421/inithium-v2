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

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

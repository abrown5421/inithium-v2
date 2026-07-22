import { z } from 'zod';
import { Result, ok, err } from 'neverthrow';
import { AppError, createValidationError } from '@inithium/types';

export const envSchema = z.object({
  MONGO_URI: z.string().url(),
  PORT: z.string().default('3000').transform((val) => parseInt(val, 10)),
  CORS_ORIGINS: z.string().transform((val) => val.split(',').map((s) => s.trim()))
});

export type EnvConfig = z.infer<typeof envSchema>;

export const parseEnv = (env: Record<string, string | undefined>): Result<EnvConfig, AppError> => {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    return err(createValidationError('Environment configuration validation failed', result.error.format()));
  }
  return ok(result.data);
};
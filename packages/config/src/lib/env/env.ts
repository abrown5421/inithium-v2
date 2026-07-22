import { z } from 'zod';
import { Result, ok, err } from 'neverthrow';
import { AppError, createValidationError } from '@inithium/types';

export const envSchema = z.object({
  MONGO_URI: z.string().url(),
  PORT: z.string().default('3000').transform((val) => parseInt(val, 10)),
  CORS_ORIGINS: z.string().transform((val) => val.split(',').map((s) => s.trim())),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  COOKIE_SECURE: z.string().default('false').transform((val) => val === 'true'),
  COOKIE_DOMAIN: z.string().optional(),
  APP_FILE_ROOT: z.string().min(1),
  FILE_UPLOAD_MAX_SIZE_MB: z.string().default('10').transform((val) => parseInt(val, 10))
});

export type EnvConfig = z.infer<typeof envSchema>;

export const parseEnv = (env: Record<string, string | undefined>): Result<EnvConfig, AppError> => {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    return err(createValidationError('Environment configuration validation failed', result.error.format()));
  }
  return ok(result.data);
};

import { z } from 'zod';
import { Result, ok, err } from 'neverthrow';
import { AppError, createValidationError } from '@inithium/types';

export const validateDoc = <T>(schema: z.ZodSchema<T>) => (data: unknown): Result<T, AppError> => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return err(createValidationError('Document validation failed', parsed.error.format()));
  }
  return ok(parsed.data);
};

export const validateManyDocs = <T>(schema: z.ZodSchema<T>) => (data: readonly unknown[]): Result<readonly T[], AppError> => {
  const arraySchema = z.array(schema);
  const parsed = arraySchema.safeParse(data);
  if (!parsed.success) {
    return err(createValidationError('Batch document validation failed', parsed.error.format()));
  }
  return ok(parsed.data);
};
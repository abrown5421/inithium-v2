import path from 'node:path';
import { Result, ok, err } from 'neverthrow';
import { AppError, createValidationError } from '@inithium/types';

export const resolveSafePath = (rootDir: string, relativePath: string): Result<string, AppError> => {
  if (!relativePath || typeof relativePath !== 'string') {
    return err(createValidationError('filePath is required'));
  }

  if (path.isAbsolute(relativePath) || /^[a-zA-Z]:[\\/]/.test(relativePath)) {
    return err(createValidationError('filePath must be relative to the file root, not absolute'));
  }

  const resolvedRoot = path.resolve(rootDir);
  const resolvedTarget = path.resolve(resolvedRoot, relativePath);
  const relativeToRoot = path.relative(resolvedRoot, resolvedTarget);
  const escapesRoot = relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot);

  if (escapesRoot) {
    return err(createValidationError('filePath resolves outside of the permitted root directory'));
  }

  return ok(resolvedTarget);
};
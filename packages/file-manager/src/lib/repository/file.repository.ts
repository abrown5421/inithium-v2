import fs from 'node:fs/promises';
import path from 'node:path';
import { ResultAsync } from 'neverthrow';
import { AppError, createNotFoundError, createConflictError, createValidationError } from '@inithium/types';

const pathExists = async (targetPath: string): Promise<boolean> => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const asAppError = (error: unknown): AppError =>
  error && typeof error === 'object' && 'type' in error
    ? (error as AppError)
    : createValidationError('Unexpected file system error', error instanceof Error ? error.message : error);

export interface FileRepository {
  readonly createFile: (targetPath: string, content: Buffer) => ResultAsync<void, AppError>;
  readonly updateFile: (targetPath: string, content: Buffer) => ResultAsync<void, AppError>;
  readonly deleteFile: (targetPath: string) => ResultAsync<void, AppError>;
  readonly moveFile: (sourcePath: string, targetPath: string) => ResultAsync<void, AppError>;
}

export const createFileRepository = (): FileRepository => ({
  createFile: (targetPath, content) =>
    ResultAsync.fromPromise(
      (async () => {
        if (await pathExists(targetPath)) {
          throw createConflictError(`A file already exists at "${path.basename(targetPath)}"`);
        }
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, content);
      })(),
      asAppError
    ),

  updateFile: (targetPath, content) =>
    ResultAsync.fromPromise(
      (async () => {
        if (!(await pathExists(targetPath))) {
          throw createNotFoundError('No file found at the given filePath');
        }
        await fs.writeFile(targetPath, content);
      })(),
      asAppError
    ),

  deleteFile: (targetPath) =>
    ResultAsync.fromPromise(
      (async () => {
        if (!(await pathExists(targetPath))) {
          throw createNotFoundError('No file found at the given filePath');
        }
        await fs.unlink(targetPath);
      })(),
      asAppError
    ),

  moveFile: (sourcePath, targetPath) =>
    ResultAsync.fromPromise(
      (async () => {
        if (!(await pathExists(sourcePath))) {
          throw createNotFoundError('No file found at the given sourcePath');
        }
        if (await pathExists(targetPath)) {
          throw createConflictError('A file already exists at the given targetPath');
        }
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.rename(sourcePath, targetPath);
      })(),
      asAppError
    )
});
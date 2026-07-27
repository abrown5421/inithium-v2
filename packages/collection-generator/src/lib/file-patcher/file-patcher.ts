import fs from 'node:fs/promises';
import { ResultAsync } from 'neverthrow';
import { AppError, createValidationError } from '@inithium/types';
import { FileManagerService } from '@inithium/file-manager';

const asAppError = (error: unknown): AppError =>
  createValidationError('Failed to patch generated file', error instanceof Error ? error.message : error);

const readFileAtPath = (
  fileManagerService: FileManagerService,
  filePath: string
): ResultAsync<{ absolutePath: string; content: string }, AppError> =>
  fileManagerService.resolveExistingFile({ filePath }).andThen(({ absolutePath }) =>
    ResultAsync.fromPromise(
      fs.readFile(absolutePath, 'utf-8').then((content) => ({ absolutePath, content })),
      asAppError
    )
  );

const writeFileAtPath = (absolutePath: string, content: string): ResultAsync<void, AppError> =>
  ResultAsync.fromPromise(fs.writeFile(absolutePath, content, 'utf-8'), asAppError);

export const appendLine = (
  fileManagerService: FileManagerService,
  filePath: string,
  line: string
): ResultAsync<void, AppError> =>
  readFileAtPath(fileManagerService, filePath).andThen(({ absolutePath, content }) => {
    const trimmed = content.endsWith('\n') ? content : `${content}\n`;
    return writeFileAtPath(absolutePath, `${trimmed}${line}\n`);
  });

export const insertBeforeMarker = (
  fileManagerService: FileManagerService,
  filePath: string,
  marker: string,
  line: string
): ResultAsync<void, AppError> =>
  readFileAtPath(fileManagerService, filePath).andThen(({ absolutePath, content }) => {
    if (!content.includes(marker)) {
      return ResultAsync.fromPromise(
        Promise.reject(createValidationError(`Marker "${marker}" not found in ${filePath}`)),
        (e) => e as AppError
      );
    }
    return writeFileAtPath(absolutePath, content.replace(marker, `${line}\n${marker}`));
  });

export const removeLineContaining = (
  fileManagerService: FileManagerService,
  filePath: string,
  needle: string
): ResultAsync<void, AppError> =>
  readFileAtPath(fileManagerService, filePath).andThen(({ absolutePath, content }) => {
    const updated = content
      .split('\n')
      .filter((line) => !line.includes(needle))
      .join('\n');
    return writeFileAtPath(absolutePath, updated);
  });
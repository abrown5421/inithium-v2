import { Result, ResultAsync, ok, err } from 'neverthrow';
import { AppError, createValidationError } from '@inithium/types';
import { validateDoc } from '@inithium/validators';
import {
  createFileSchema, updateFileSchema, deleteFileSchema, moveFileSchema,
  CreateFileDTO, UpdateFileDTO, DeleteFileDTO, MoveFileDTO
} from '@inithium/validators';
import { resolveSafePath } from '../path/path.js';
import { FileRepository } from '../repository/file.repository.js';

export interface FileManagerConfig {
  readonly rootDir: string;
}

const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;

const decodeBase64 = (fileContent: string): Result<Buffer, AppError> =>
  BASE64_PATTERN.test(fileContent)
    ? ok(Buffer.from(fileContent, 'base64'))
    : err(createValidationError('fileContent must be a valid base64-encoded string'));

export interface FileManagerService {
  readonly createFile: (dto: CreateFileDTO) => ResultAsync<{ filePath: string }, AppError>;
  readonly updateFile: (dto: UpdateFileDTO) => ResultAsync<{ filePath: string }, AppError>;
  readonly deleteFile: (dto: DeleteFileDTO) => ResultAsync<{ filePath: string }, AppError>;
  readonly moveFile: (dto: MoveFileDTO) => ResultAsync<{ sourcePath: string; targetPath: string }, AppError>;
  readonly resolveExistingFile: (dto: { filePath: string }) => ResultAsync<{ absolutePath: string }, AppError>;
}

export const createFileManagerService = (repo: FileRepository, config: FileManagerConfig): FileManagerService => ({
  createFile: (dto) =>
    validateDoc(createFileSchema)(dto).asyncAndThen(({ filePath, fileContent }) =>
      resolveSafePath(config.rootDir, filePath).asyncAndThen((resolvedPath) =>
        decodeBase64(fileContent).asyncAndThen((buffer) =>
          repo.createFile(resolvedPath, buffer).map(() => ({ filePath }))
        )
      )
    ),

  updateFile: (dto) =>
    validateDoc(updateFileSchema)(dto).asyncAndThen(({ filePath, fileContent }) =>
      resolveSafePath(config.rootDir, filePath).asyncAndThen((resolvedPath) =>
        decodeBase64(fileContent).asyncAndThen((buffer) =>
          repo.updateFile(resolvedPath, buffer).map(() => ({ filePath }))
        )
      )
    ),

  deleteFile: (dto) =>
    validateDoc(deleteFileSchema)(dto).asyncAndThen(({ filePath }) =>
      resolveSafePath(config.rootDir, filePath).asyncAndThen((resolvedPath) =>
        repo.deleteFile(resolvedPath).map(() => ({ filePath }))
      )
    ),

  moveFile: (dto) =>
    validateDoc(moveFileSchema)(dto).asyncAndThen(({ sourcePath, targetPath }) =>
      resolveSafePath(config.rootDir, sourcePath).asyncAndThen((resolvedSource) =>
        resolveSafePath(config.rootDir, targetPath).asyncAndThen((resolvedTarget) =>
          repo.moveFile(resolvedSource, resolvedTarget).map(() => ({ sourcePath, targetPath }))
        )
      )
    ),

  resolveExistingFile: (dto) =>
    resolveSafePath(config.rootDir, dto.filePath).asyncAndThen((resolvedPath) =>
      repo.resolveExistingFile(resolvedPath)
    )
});
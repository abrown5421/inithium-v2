import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Filter } from 'mongodb';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { AppError, PaginatedResult, createNotFoundError, createForbiddenError, createValidationError } from '@inithium/types';
import { CrudRepository, CrudService, createService } from '@inithium/crud-engine';
import {
  FileManagerService,
  isOptimizableImage,
  optimizeImage,
  isConvertibleFont,
  optimizeFont
} from '@inithium/file-manager';
import {
  CreateAssetDTO,
  UpdateAssetDTO,
  uploadAssetInputSchema,
  createAssetSchema,
  updateAssetSchema,
  replaceAssetFileInputSchema,
  validateDoc
} from '@inithium/validators';
import { Asset, AssetCategory, AssetWithUrl } from '@inithium/models';

export interface UploadAssetInput {
  readonly fileContentBase64: string;
  readonly originalName: string;
  readonly mimeType: string;
  readonly userId: string;
  readonly isSystem?: boolean;
  /** Only for deterministic boot-time seeding (e.g. default system fonts hardcoded into `@font-face` URLs) — normal uploads always get a fresh random key. */
  readonly key?: string;
}

export interface ReplaceAssetFileInput {
  readonly fileContentBase64: string;
  readonly fileName: string;
  readonly mimeType: string;
}

export interface AssetService {
  readonly uploadAsset: (input: UploadAssetInput) => ResultAsync<AssetWithUrl, AppError>;
  readonly replaceAssetFile: (id: string, input: ReplaceAssetFileInput) => ResultAsync<AssetWithUrl, AppError>;
  readonly getAssetFileStreamByKey: (
    key: string
  ) => ResultAsync<{ filePath: string; mimeType: string; sizeBytes: number; updatedAt: Date }, AppError>;
  readonly deleteAssetByKey: (key: string, requesterUserId: string, isAdmin: boolean) => ResultAsync<void, AppError>;
  readonly readOne: (id: string) => ResultAsync<AssetWithUrl, AppError>;
  readonly readAll: (
    page?: number,
    limit?: number,
    filter?: Record<string, unknown>
  ) => ResultAsync<PaginatedResult<AssetWithUrl>, AppError>;
  readonly updateOne: (id: string, dto: UpdateAssetDTO) => ResultAsync<AssetWithUrl, AppError>;
  readonly createOne: CrudService<Asset, CreateAssetDTO, UpdateAssetDTO>['createOne'];
  readonly deleteOne: CrudService<Asset, CreateAssetDTO, UpdateAssetDTO>['deleteOne'];
}

/** Fonts/archives/data files don't share a consistent `mimeType` family across browsers/OSes, so they're classified by extension instead. */
const EXTENSION_CATEGORIES: Readonly<Record<string, AssetCategory>> = {
  '.ttf': 'fonts',
  '.otf': 'fonts',
  '.woff': 'fonts',
  '.woff2': 'fonts',
  '.zip': 'archives',
  '.tar.gz': 'archives',
  '.rar': 'archives',
  '.json': 'data',
  '.csv': 'data',
  '.xml': 'data'
};

const getExtension = (filename: string): string => {
  const lower = filename.toLowerCase();
  return lower.endsWith('.tar.gz') ? '.tar.gz' : path.extname(lower);
};

const determineCategory = (mimeType: string, originalName: string): AssetCategory => {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType === 'application/pdf') return 'pdfs';
  if (mimeType.startsWith('video/')) return 'videos';
  if (mimeType.startsWith('audio/')) return 'audio';
  return EXTENSION_CATEGORIES[getExtension(originalName)] ?? 'other';
};

const changeExtension = (filename: string, newExtension: string): string => {
  const currentExtension = getExtension(filename);
  const baseName = currentExtension ? filename.slice(0, -currentExtension.length) : filename;
  return `${baseName}${newExtension}`;
};

/**
 * Single choke point every asset upload passes through before anything touches disk: raster
 * images get re-encoded to WebP and dimension-capped, TTF/OTF fonts get converted to WOFF2.
 * Applies uniformly regardless of caller (user upload, system/admin upload, file replacement).
 */
const optimizeUploadContent = (
  buffer: Buffer,
  mimeType: string,
  originalName: string
): ResultAsync<{ buffer: Buffer; mimeType: string; originalName: string }, AppError> => {
  if (isOptimizableImage(mimeType)) {
    return ResultAsync.fromPromise(optimizeImage(buffer), () =>
      createValidationError('Could not process the uploaded image file')
    ).map((optimized) => ({
      buffer: optimized.buffer,
      mimeType: optimized.mimeType,
      originalName: changeExtension(originalName, optimized.extension)
    }));
  }

  if (isConvertibleFont(getExtension(originalName))) {
    return ResultAsync.fromPromise(optimizeFont(buffer), () =>
      createValidationError('Could not process the uploaded font file')
    ).map((optimized) => ({
      buffer: optimized.buffer,
      mimeType: optimized.mimeType,
      originalName: changeExtension(originalName, optimized.extension)
    }));
  }

  return okAsync({ buffer, mimeType, originalName });
};

const buildAssetPath = (category: AssetCategory, isSystem: boolean, userId: string, filename: string): string =>
  isSystem
    ? path.posix.join('user-assets'.replace('user-assets', 'system-assets'), category, filename)
    : path.posix.join('user-assets', category, userId, filename);

const toAssetWithUrl = (asset: Asset, publicAssetBaseUrl: string): AssetWithUrl => ({
  ...asset,
  url: `${publicAssetBaseUrl}/assets/by-key/${asset.key}`
});

const findAssetByKey = (repo: CrudRepository<Asset>, key: string): ResultAsync<Asset, AppError> =>
  repo.readAll(1, 1, { key } as Filter<Asset>).andThen((result) =>
    result.data.length > 0
      ? okAsync(result.data[0])
      : errAsync(createNotFoundError(`No asset found with key "${key}"`))
  );

export const createAssetService = (
  repo: CrudRepository<Asset>,
  fileManagerService: FileManagerService,
  createSchema: typeof createAssetSchema,
  updateSchema: typeof updateAssetSchema,
  publicAssetBaseUrl: string
): AssetService => {
  const baseCrud = createService<Asset, CreateAssetDTO, UpdateAssetDTO>(repo, createSchema, updateSchema);

  return {
    createOne: baseCrud.createOne,
    deleteOne: baseCrud.deleteOne,

    readAll: (page, limit, filter) =>
      baseCrud
        .readAll(page, limit, filter)
        .map((result) => ({ ...result, data: result.data.map((asset) => toAssetWithUrl(asset, publicAssetBaseUrl)) })),

    readOne: (id) => baseCrud.readOne(id).map((asset) => toAssetWithUrl(asset, publicAssetBaseUrl)),

    updateOne: (id, dto) => baseCrud.updateOne(id, dto).map((asset) => toAssetWithUrl(asset, publicAssetBaseUrl)),

    uploadAsset: (input) => {
      const validation = validateDoc(uploadAssetInputSchema)({
        fileContentBase64: input.fileContentBase64,
        originalName: input.originalName,
        mimeType: input.mimeType,
        isSystem: input.isSystem
      });

      if (validation.isErr()) return errAsync(validation.error);
      const valid = validation.value;

      let rawBuffer: Buffer;
      try {
        rawBuffer = Buffer.from(valid.fileContentBase64, 'base64');
      } catch {
        return errAsync(createNotFoundError('fileContent must be a valid base64-encoded string'));
      }

      return optimizeUploadContent(rawBuffer, valid.mimeType, valid.originalName)
        .andThen((prepared) => {
          const category = determineCategory(prepared.mimeType, prepared.originalName);
          const key = input.key ?? randomUUID();
          const extension = path.extname(prepared.originalName);
          const filename = `${key}${extension}`;
          const uploadedBy = valid.isSystem ? 'system' : input.userId;
          const filePath = buildAssetPath(category, valid.isSystem, input.userId, filename);

          const rollbackAndFail = (error: AppError): ResultAsync<Asset, AppError> =>
            fileManagerService.deleteFile({ filePath })
              .map(() => undefined)
              .mapErr((cleanupError) => {
                console.error(`Failed to clean up orphaned asset file at "${filePath}" after a metadata write failure`, cleanupError);
                return cleanupError;
              })
              .andThen(() => errAsync(error))
              .orElse(() => errAsync(error));

          return fileManagerService
            .createFile({ filePath, fileContent: prepared.buffer.toString('base64') })
            .andThen(() => {
              const createDtoResult = validateDoc(createSchema)({
                key,
                originalName: prepared.originalName,
                filePath,
                mimeType: prepared.mimeType,
                sizeBytes: prepared.buffer.byteLength,
                uploadedBy,
                isSystem: valid.isSystem,
                category
              });

              if (createDtoResult.isErr()) {
                return rollbackAndFail(createDtoResult.error);
              }

              return repo.createOne(createDtoResult.value).orElse(rollbackAndFail);
            });
        })
        .map((asset) => toAssetWithUrl(asset, publicAssetBaseUrl));
    },

    replaceAssetFile: (id, input) => {
      const validation = validateDoc(replaceAssetFileInputSchema)(input);
      if (validation.isErr()) return errAsync(validation.error);
      const valid = validation.value;

      let rawBuffer: Buffer;
      try {
        rawBuffer = Buffer.from(valid.fileContentBase64, 'base64');
      } catch {
        return errAsync(createValidationError('fileContent must be a valid base64-encoded string'));
      }

      return optimizeUploadContent(rawBuffer, valid.mimeType, valid.fileName)
        .andThen((prepared) =>
          repo.readOne(id).andThen((asset) => {
            const newCategory = determineCategory(prepared.mimeType, prepared.originalName);
            if (newCategory !== asset.category) {
              return errAsync(
                createValidationError(`Replacement file must match the existing asset's type (expected a "${asset.category}" file)`)
              );
            }

            const directory = path.posix.dirname(asset.filePath);
            const newExtension = getExtension(prepared.originalName);
            const currentExtension = getExtension(asset.filePath);
            const targetFilePath =
              newExtension === currentExtension ? asset.filePath : path.posix.join(directory, `${asset.key}${newExtension}`);

            const applyMetadata = (): ResultAsync<Asset, AppError> =>
              repo.updateOne(id, {
                filePath: targetFilePath,
                mimeType: prepared.mimeType,
                sizeBytes: prepared.buffer.byteLength
              });

            const overwritten = fileManagerService.updateFile({
              filePath: asset.filePath,
              fileContent: prepared.buffer.toString('base64')
            });

            if (targetFilePath === asset.filePath) {
              return overwritten.andThen(applyMetadata);
            }

            return overwritten
              .andThen(() => fileManagerService.moveFile({ sourcePath: asset.filePath, targetPath: targetFilePath }))
              .andThen(applyMetadata);
          })
        )
        .map((asset) => toAssetWithUrl(asset, publicAssetBaseUrl));
    },

    getAssetFileStreamByKey: (key) =>
      findAssetByKey(repo, key).andThen((asset) =>
        fileManagerService.resolveExistingFile({ filePath: asset.filePath }).map((resolved) => ({
          filePath: resolved.absolutePath,
          mimeType: asset.mimeType,
          sizeBytes: asset.sizeBytes,
          updatedAt: asset.updatedAt
        }))
      ),

    deleteAssetByKey: (key, requesterUserId, isAdmin) =>
      findAssetByKey(repo, key).andThen((asset) => {
        const isOwner = asset.uploadedBy === requesterUserId;
        if (!isOwner && !isAdmin) {
          return errAsync(createForbiddenError('You do not have permission to delete this asset'));
        }
        return fileManagerService.deleteFile({ filePath: asset.filePath }).andThen(() => repo.deleteOne(asset._id));
      })
  };
};
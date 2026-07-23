import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Filter } from 'mongodb';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { AppError, createNotFoundError, createForbiddenError } from '@inithium/types';
import { CrudRepository, CrudService, createService } from '@inithium/crud-engine';
import { FileManagerService } from '@inithium/file-manager';
import { 
  CreateAssetDTO, 
  UpdateAssetDTO, 
  uploadAssetInputSchema, 
  createAssetSchema, 
  updateAssetSchema, 
  validateDoc 
} from '@inithium/validators';
import { Asset, AssetCategory, AssetWithUrl } from '@inithium/models';

export interface UploadAssetInput {
  readonly fileContentBase64: string;
  readonly originalName: string;
  readonly mimeType: string;
  readonly userId: string;
  readonly isSystem?: boolean;
}

export interface AssetService {
  readonly uploadAsset: (input: UploadAssetInput) => ResultAsync<AssetWithUrl, AppError>;
  readonly getAssetFileStreamByKey: (key: string) => ResultAsync<{ filePath: string; mimeType: string }, AppError>;
  readonly deleteAssetByKey: (key: string, requesterUserId: string, isAdmin: boolean) => ResultAsync<void, AppError>;
  readonly readOne: (id: string) => ResultAsync<AssetWithUrl, AppError>;
  readonly readAll: CrudService<Asset, CreateAssetDTO, UpdateAssetDTO>['readAll'];
  readonly updateOne: (id: string, dto: UpdateAssetDTO) => ResultAsync<AssetWithUrl, AppError>;
  readonly createOne: CrudService<Asset, CreateAssetDTO, UpdateAssetDTO>['createOne'];
  readonly deleteOne: CrudService<Asset, CreateAssetDTO, UpdateAssetDTO>['deleteOne'];
}

const determineCategory = (mimeType: string): AssetCategory => {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType === 'application/pdf') return 'pdfs';
  if (mimeType.startsWith('video/')) return 'videos';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'other';
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
    readAll: baseCrud.readAll,

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

      let buffer: Buffer;
      try {
        buffer = Buffer.from(valid.fileContentBase64, 'base64');
      } catch {
        return errAsync(createNotFoundError('fileContent must be a valid base64-encoded string'));
      }

      const category = determineCategory(valid.mimeType);
      const key = randomUUID();
      const extension = path.extname(valid.originalName);
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

      return fileManagerService.createFile({ filePath, fileContent: valid.fileContentBase64 }).andThen(() => {
        const createDtoResult = validateDoc(createSchema)({
          key,
          originalName: valid.originalName,
          filePath,
          mimeType: valid.mimeType,
          sizeBytes: buffer.byteLength,
          uploadedBy,
          isSystem: valid.isSystem
        });

        if (createDtoResult.isErr()) {
          return rollbackAndFail(createDtoResult.error);
        }

        return repo.createOne(createDtoResult.value).orElse(rollbackAndFail);
      }).map((asset) => toAssetWithUrl(asset, publicAssetBaseUrl));
    },

    getAssetFileStreamByKey: (key) =>
      findAssetByKey(repo, key).andThen((asset) =>
        fileManagerService.resolveExistingFile({ filePath: asset.filePath }).map((resolved) => ({
          filePath: resolved.absolutePath,
          mimeType: asset.mimeType
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
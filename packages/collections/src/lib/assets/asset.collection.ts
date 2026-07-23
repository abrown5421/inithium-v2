import { Db } from 'mongodb';
import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { createRepository } from '@inithium/crud-engine';
import { ensureIndex } from '@inithium/db';
import { FileManagerService } from '@inithium/file-manager';
import { Asset } from '@inithium/models';
import { createAssetSchema, updateAssetSchema } from '@inithium/validators';
import { AssetService, createAssetService } from '@inithium/services';
import { createAssetRouter, AssetRouterConfig } from '@inithium/routes';
import { Router } from 'express';

export interface AssetCollectionConfig extends AssetRouterConfig {
  readonly fileManagerService: FileManagerService;
  readonly publicAssetBaseUrl: string;
}

export interface AssetCollection {
  readonly service: AssetService;
  readonly router: Router;
}

export const createAssetCollection = (db: Db, config: AssetCollectionConfig): AssetCollection => {
  const repository = createRepository<Asset>(db, 'assets');
  const service = createAssetService(
    repository,
    config.fileManagerService,
    createAssetSchema,
    updateAssetSchema,
    config.publicAssetBaseUrl
  );
  const router = createAssetRouter(service, config);
  return { service, router };
};

export const ensureAssetIndices = (db: Db): ResultAsync<string, AppError> =>
  ensureIndex(db, 'assets', { key: 1 }, { unique: true });
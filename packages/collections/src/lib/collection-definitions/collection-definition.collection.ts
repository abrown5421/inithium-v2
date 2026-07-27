import { Db } from 'mongodb';
import { Router } from 'express';
import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { createRepository, CrudRouterOptions, createCrudRouter } from '@inithium/crud-engine';
import { ensureIndex } from '@inithium/db';
import { CollectionDefinition } from '@inithium/models';
import { createCollectionDefinitionService } from '@inithium/services';
import { CollectionGeneratorConfig } from '@inithium/collection-generator';

export interface CollectionDefinitionCollectionConfig extends CrudRouterOptions {
  readonly generatorConfig: CollectionGeneratorConfig;
}

export interface CollectionDefinitionCollection {
  readonly service: ReturnType<typeof createCollectionDefinitionService>;
  readonly router: Router;
}

export const createCollectionDefinitionCollection = (
  db: Db,
  config: CollectionDefinitionCollectionConfig
): CollectionDefinitionCollection => {
  const repository = createRepository<CollectionDefinition>(db, 'collection-definitions');
  const service = createCollectionDefinitionService(repository, config.generatorConfig);
  const router = createCrudRouter(service, config);
  return { service, router };
};

export const ensureCollectionDefinitionIndices = (db: Db): ResultAsync<string, AppError> =>
  ensureIndex(db, 'collection-definitions', { name: 1 }, { unique: true });
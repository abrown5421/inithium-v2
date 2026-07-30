import { Db } from 'mongodb';
import { Router } from 'express';
import { ResultAsync } from 'neverthrow';
import { createRepository, createService, createCrudRouter, CrudRouterOptions } from '@inithium/crud-engine';
import { ensureIndex } from '@inithium/db';
import { AppError } from '@inithium/types';
import { Page } from '@inithium/models';
import {
  createPageSchema,
  updatePageSchema,
  CreatePageDTO,
  UpdatePageDTO
} from '@inithium/validators';

export interface PageCollection {
  readonly service: ReturnType<typeof createService<Page, CreatePageDTO, UpdatePageDTO>>;
  readonly router: Router;
}

export const createPageCollection = (db: Db, config: CrudRouterOptions): PageCollection => {
  const repository = createRepository<Page>(db, 'pages');
  const service = createService<Page, CreatePageDTO, UpdatePageDTO>(
    repository,
    createPageSchema,
    updatePageSchema
  );
  const router = createCrudRouter(service, config);
  return { service, router };
};

export const ensurePageIndices = (db: Db): ResultAsync<string, AppError> =>
  ensureIndex(db, 'pages', { id: 1 }, { unique: true }).andThen(() =>
    ensureIndex(db, 'pages', { app: 1, route: 1 }, { unique: true })
  );

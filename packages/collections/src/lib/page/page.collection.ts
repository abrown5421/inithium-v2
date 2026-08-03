import { Db } from 'mongodb';
import { Router, RequestHandler } from 'express';
import { ResultAsync } from 'neverthrow';
import { createRepository, createService } from '@inithium/crud-engine';
import { createPageRouter } from '@inithium/routes';
import { ensureIndex } from '@inithium/db';
import { AppError } from '@inithium/types';
import { Page } from '@inithium/models';
import {
  createPageSchema,
  updatePageSchema,
  CreatePageDTO,
  UpdatePageDTO
} from '@inithium/validators';

export interface PageCollectionConfig {
  readonly authenticate: RequestHandler;
}

export interface PageCollection {
  readonly service: ReturnType<typeof createService<Page, CreatePageDTO, UpdatePageDTO>>;
  readonly router: Router;
}

export const createPageCollection = (db: Db, config: PageCollectionConfig): PageCollection => {
  const repository = createRepository<Page>(db, 'pages');
  const service = createService<Page, CreatePageDTO, UpdatePageDTO>(
    repository,
    createPageSchema,
    updatePageSchema
  );
  const router = createPageRouter(service, { authenticate: config.authenticate });
  return { service, router };
};

export const ensurePageIndices = (db: Db): ResultAsync<string, AppError> =>
  ensureIndex(db, 'pages', { id: 1 }, { unique: true }).andThen(() =>
    ensureIndex(db, 'pages', { app: 1, route: 1 }, { unique: true })
  );

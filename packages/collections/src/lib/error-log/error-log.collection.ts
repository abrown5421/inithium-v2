import { Db } from 'mongodb';
import { Router, RequestHandler } from 'express';
import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { ensureIndex } from '@inithium/db';
import { createErrorLogService, ErrorLogService } from '@inithium/services';
import { createErrorLogRouter } from '@inithium/routes';

export interface ErrorLogCollectionConfig {
  readonly authenticate: RequestHandler;
  readonly requireCmsRole: RequestHandler;
  readonly ingestRateLimit: RequestHandler;
}

export interface ErrorLogCollection {
  readonly service: ErrorLogService;
  readonly router: Router;
}

const SECONDS_PER_DAY = 86400;

export const createErrorLogCollection = (db: Db, config: ErrorLogCollectionConfig): ErrorLogCollection => {
  const service = createErrorLogService(db);
  const router = createErrorLogRouter(service, config);
  return { service, router };
};

export const ensureErrorLogIndices = (db: Db, retentionDays: number): ResultAsync<string, AppError> =>
  ensureIndex(db, 'error-logs', { fingerprint: 1 }, { unique: true })
    .andThen(() => ensureIndex(db, 'error-logs', { updatedAt: 1 }, { expireAfterSeconds: retentionDays * SECONDS_PER_DAY }))
    .andThen(() => ensureIndex(db, 'error-logs', { appId: 1, updatedAt: -1 }));

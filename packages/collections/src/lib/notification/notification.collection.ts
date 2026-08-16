import { Db } from 'mongodb';
import { Router, RequestHandler } from 'express';
import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { ensureIndex } from '@inithium/db';
import { createNotificationService, NotificationService } from '@inithium/services';
import { createNotificationRouter } from '@inithium/routes';

export interface NotificationCollectionConfig {
  readonly authenticate: RequestHandler;
}

export interface NotificationCollection {
  readonly service: NotificationService;
  readonly router: Router;
}

export const createNotificationCollection = (db: Db, config: NotificationCollectionConfig): NotificationCollection => {
  const service = createNotificationService(db);
  const router = createNotificationRouter(service, config);
  return { service, router };
};

export const ensureNotificationIndices = (db: Db): ResultAsync<string, AppError> =>
  ensureIndex(db, 'notifications', { userId: 1, read: 1, createdAt: -1 });

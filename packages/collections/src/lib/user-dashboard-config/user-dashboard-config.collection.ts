import { Db } from 'mongodb';
import { Router, RequestHandler } from 'express';
import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { createRepository } from '@inithium/crud-engine';
import { ensureIndex } from '@inithium/db';
import { UserDashboardConfig } from '@inithium/models';
import { createUserDashboardConfigService, UserDashboardConfigService } from '@inithium/services';
import { createUserDashboardConfigRouter } from '@inithium/routes';
import { ReportableCollectionsResolver } from '@inithium/analytics';

export interface UserDashboardConfigCollectionConfig {
  readonly authenticate: RequestHandler;
  readonly reportableCollectionsResolver: ReportableCollectionsResolver;
}

export interface UserDashboardConfigCollection {
  readonly service: UserDashboardConfigService;
  readonly router: Router;
}

export const createUserDashboardConfigCollection = (
  db: Db,
  config: UserDashboardConfigCollectionConfig
): UserDashboardConfigCollection => {
  const repository = createRepository<UserDashboardConfig>(db, 'user-dashboard-configs');
  const service = createUserDashboardConfigService(repository);
  const router = createUserDashboardConfigRouter(service, config);
  return { service, router };
};

export const ensureUserDashboardConfigIndices = (db: Db): ResultAsync<string, AppError> =>
  ensureIndex(db, 'user-dashboard-configs', { userId: 1 }, { unique: true });

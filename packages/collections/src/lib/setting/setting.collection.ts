import { Db } from 'mongodb';
import { Router, RequestHandler } from 'express';
import { createRepository } from '@inithium/crud-engine';
import { createSettingService, SettingService } from '@inithium/services';
import { createSettingRouter } from '@inithium/routes';
import { Setting } from '@inithium/models';

export interface SettingCollectionConfig {
  readonly authenticate: RequestHandler;
}

export interface SettingCollection {
  readonly service: SettingService;
  readonly router: Router;
}

export const createSettingCollection = (db: Db, config: SettingCollectionConfig): SettingCollection => {
  const repository = createRepository<Setting>(db, 'settings');
  const service = createSettingService(repository);
  const router = createSettingRouter(service, { authenticate: config.authenticate });
  return { service, router };
};

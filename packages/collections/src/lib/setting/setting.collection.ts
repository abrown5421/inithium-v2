import { Db } from 'mongodb';
import { Router } from 'express';
import { createRepository, createService, createCrudRouter, CrudRouterOptions } from '@inithium/crud-engine';
import { Setting } from '@inithium/models';
import {
  createSettingSchema,
  updateSettingSchema,
  CreateSettingDTO,
  UpdateSettingDTO
} from '@inithium/validators';

export interface SettingCollection {
  readonly service: ReturnType<typeof createService<Setting, CreateSettingDTO, UpdateSettingDTO>>;
  readonly router: Router;
}

export const createSettingCollection = (db: Db, config: CrudRouterOptions): SettingCollection => {
  const repository = createRepository<Setting>(db, 'settings');
  const service = createService<Setting, CreateSettingDTO, UpdateSettingDTO>(
    repository,
    createSettingSchema,
    updateSettingSchema
  );
  const router = createCrudRouter(service, config);
  return { service, router };
};

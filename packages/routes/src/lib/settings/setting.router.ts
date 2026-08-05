import { Router, RequestHandler } from 'express';
import { createCrudRouter, CrudService } from '@inithium/crud-engine';
import { Setting } from '@inithium/models';
import { CreateSettingDTO, UpdateSettingDTO } from '@inithium/validators';

export interface SettingRouterConfig {
  readonly authenticate: RequestHandler;
}

export const createSettingRouter = (
  settingService: CrudService<Setting, CreateSettingDTO, UpdateSettingDTO>,
  config: SettingRouterConfig
): Router =>
  createCrudRouter(settingService, {
    authenticate: config.authenticate,
    publicRoutes: ['readAll', 'readOne', 'readMany'],
    searchableFields: ['settingName']
  });

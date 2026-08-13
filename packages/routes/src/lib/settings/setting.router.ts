import { Router, RequestHandler } from 'express';
import { createCrudRouter, createMatrixAuthorizer, CrudService } from '@inithium/crud-engine';
import { createRequireRoleMiddleware } from '@inithium/auth';
import { CMS_ROLES, SETTING_EDITABLE_FIELDS, SETTING_PERMISSION_MATRIX } from '@inithium/types';
import { Setting } from '@inithium/models';
import { CreateSettingDTO, UpdateSettingDTO } from '@inithium/validators';

export interface SettingRouterConfig {
  readonly authenticate: RequestHandler;
}

const authorizeSettingOperation = createMatrixAuthorizer({
  matrix: SETTING_PERMISSION_MATRIX,
  allFields: SETTING_EDITABLE_FIELDS,
  getRole: (req) => req.user?.role,
  operationAction: { createOne: 'create', updateOne: 'update', deleteOne: 'delete', deleteMany: 'delete' }
});

export const createSettingRouter = (
  settingService: CrudService<Setting, CreateSettingDTO, UpdateSettingDTO>,
  config: SettingRouterConfig
): Router =>
  createCrudRouter(settingService, {
    authenticate: config.authenticate,
    publicRoutes: ['readAll', 'readOne', 'readMany'],
    protectedMiddleware: [createRequireRoleMiddleware(CMS_ROLES)],
    searchableFields: ['settingName'],
    authorize: authorizeSettingOperation
  });

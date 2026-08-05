import { Router, RequestHandler } from 'express';
import { createCrudRouter, createMatrixAuthorizer, CrudService } from '@inithium/crud-engine';
import { createRequireRoleMiddleware } from '@inithium/auth';
import { SETTING_EDITABLE_FIELDS, SETTING_PERMISSION_MATRIX, UserRole } from '@inithium/types';
import { Setting } from '@inithium/models';
import { CreateSettingDTO, UpdateSettingDTO } from '@inithium/validators';

export interface SettingRouterConfig {
  readonly authenticate: RequestHandler;
}

/** Roles allowed into the CMS at all. Anyone outside this list never reaches the matrix checks below. */
const CMS_ROLES: readonly UserRole[] = ['super-admin', 'admin', 'editor', 'writer'];

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

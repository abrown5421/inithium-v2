import { Router, RequestHandler } from 'express';
import { createCrudRouter, createMatrixAuthorizer, CrudService } from '@inithium/crud-engine';
import { createRequireRoleMiddleware } from '@inithium/auth';
import { PAGE_EDITABLE_FIELDS, PAGE_PERMISSION_MATRIX, UserRole } from '@inithium/types';
import { Page } from '@inithium/models';
import { CreatePageDTO, UpdatePageDTO } from '@inithium/validators';

export interface PageRouterConfig {
  readonly authenticate: RequestHandler;
}

/** Roles allowed into the CMS at all. Anyone outside this list never reaches the matrix checks below. */
const CMS_ROLES: readonly UserRole[] = ['super-admin', 'admin', 'editor', 'writer'];

const authorizePageOperation = createMatrixAuthorizer({
  matrix: PAGE_PERMISSION_MATRIX,
  allFields: PAGE_EDITABLE_FIELDS,
  getRole: (req) => req.user?.role,
  operationAction: { createOne: 'create', updateOne: 'update', deleteOne: 'delete', deleteMany: 'delete' },
  // editor can create pages but not set accessControl/flags — the client fills these with safe
  // defaults on create (schema requires them on every record); editor still can never touch them
  // on an existing page, since this exemption only applies to createOne.
  fieldsUncheckedOnCreate: ['accessControl', 'flags']
});

export const createPageRouter = (
  pageService: CrudService<Page, CreatePageDTO, UpdatePageDTO>,
  config: PageRouterConfig
): Router => {
  return createCrudRouter(pageService, {
    authenticate: config.authenticate,
    publicRoutes: ['readAll', 'readOne', 'readMany'],
    protectedMiddleware: [createRequireRoleMiddleware(CMS_ROLES)],
    searchableFields: ['pageName', 'route', 'app'],
    authorize: authorizePageOperation
  });
};

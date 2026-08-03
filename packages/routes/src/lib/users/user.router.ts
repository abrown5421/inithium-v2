import { Router, RequestHandler } from 'express';
import { createCrudRouter, createMatrixAuthorizer } from '@inithium/crud-engine';
import { UserService } from '@inithium/services';
import { createRequireRoleMiddleware } from '@inithium/auth';
import { UserRole, USER_EDITABLE_FIELDS, USER_PERMISSION_MATRIX } from '@inithium/types';

export interface UserRouterConfig {
  readonly authenticate: RequestHandler;
}

/** Roles allowed into the CMS at all. Anyone outside this list never reaches the matrix checks below. */
const CMS_ROLES: readonly UserRole[] = ['super-admin', 'admin', 'editor', 'writer'];

const authorizeUserOperation = createMatrixAuthorizer({
  matrix: USER_PERMISSION_MATRIX,
  allFields: USER_EDITABLE_FIELDS,
  assignableField: 'role',
  getRole: (req) => req.user?.role,
  operationAction: { createOne: 'create', updateOne: 'update', deleteOne: 'delete', deleteMany: 'delete' }
});

export const createUserRouter = (userService: UserService, config: UserRouterConfig): Router => {
  return createCrudRouter(userService, {
    authenticate: config.authenticate,
    publicRoutes: [],
    protectedMiddleware: [createRequireRoleMiddleware(CMS_ROLES)],
    searchableFields: ['first_name', 'last_name', 'email', 'role'],
    authorize: authorizeUserOperation
  });
};

import { Router, Request, Response, RequestHandler } from 'express';
import { createCrudRouter, createMatrixAuthorizer, handleResult } from '@inithium/crud-engine';
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
  const router = Router();

  /**
   * Reading a single user by id (e.g. viewing their public profile) only requires being logged
   * in, not CMS membership — registered ahead of the CMS-gated crud router below so it takes the
   * `GET /:id` request before that router's own `protectedMiddleware` ever runs. `readAll`/
   * `readMany`/writes stay CMS-gated as before.
   */
  router.get('/:id', config.authenticate, async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const result = await userService.readOne(id);
    handleResult(res, result);
  });

  router.use(
    createCrudRouter(userService, {
      authenticate: config.authenticate,
      publicRoutes: [],
      protectedMiddleware: [createRequireRoleMiddleware(CMS_ROLES)],
      searchableFields: ['first_name', 'last_name', 'email', 'role'],
      authorize: authorizeUserOperation
    })
  );

  return router;
};

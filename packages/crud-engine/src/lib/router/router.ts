import { Router, Request, Response, RequestHandler } from 'express';
import { Result, err } from 'neverthrow';
import { AppError, BaseEntity } from '@inithium/types';
import { CrudService } from '../service/service.js';

export const handleResult = <T>(res: Response, result: Result<T, AppError>, status = 200): void => {
  result.match(
    (data) => {
      res.status(status).json({ success: true, data });
    },
    (error) => {
      const statusCode =
        error.type === 'VALIDATION_ERROR'
          ? 400
          : error.type === 'UNAUTHORIZED_ERROR'
          ? 401
          : error.type === 'FORBIDDEN_ERROR'
          ? 403
          : error.type === 'NOT_FOUND_ERROR'
          ? 404
          : error.type === 'CONFLICT_ERROR'
          ? 409
          : 500;
      res.status(statusCode).json({ success: false, error });
    }
  );
};

export type CrudOperation =
  | 'createOne'
  | 'createMany'
  | 'readOne'
  | 'readMany'
  | 'readAll'
  | 'updateOne'
  | 'updateMany'
  | 'deleteOne'
  | 'deleteMany';

export interface CrudRouterOptions {
  readonly authenticate: RequestHandler;
  readonly publicRoutes?: readonly CrudOperation[];
  readonly protectedMiddleware?: readonly RequestHandler[];
  /** Fields allowed in `?field=&search=` queries against `GET /`. Omit to disable search entirely. */
  readonly searchableFields?: readonly string[];
  /**
   * Extra per-operation authorization check, run after `authenticate`/`protectedMiddleware` and
   * before the operation executes. Return an `AppError` to reject the request (its `type` maps
   * to an HTTP status the same way `handleResult` does); return `undefined` to allow it. Lets a
   * collection enforce actor- and payload-aware rules (e.g. "which fields may this role set")
   * that a static role list can't express, without forking the generic route wiring.
   */
  readonly authorize?: (req: Request, operation: CrudOperation) => AppError | undefined;
}

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * `string` fields get a substring, case-insensitive match (progressive search-as-you-type).
 * `enum`/`boolean` fields get an exact match, since the UI restricts input to a closed set of
 * values and a substring match would false-positive on values that contain each other (e.g. a
 * role search for "admin" would otherwise also match "super-admin").
 */
const buildSearchFilterValue = (search: string, fieldType: string | undefined): unknown => {
  if (fieldType === 'boolean') return search === 'true';
  if (fieldType === 'enum') return search;
  return { $regex: escapeRegExp(search), $options: 'i' };
};

export const createCrudRouter = <T extends BaseEntity, CreateDTO, UpdateDTO>(
  service: CrudService<T, CreateDTO, UpdateDTO>,
  options: CrudRouterOptions
): Router => {
  const router = Router();
  const publicRoutes = options.publicRoutes ?? [];
  const protectedMiddleware = options.protectedMiddleware ?? [];

  const guard = (operation: CrudOperation): readonly RequestHandler[] => {
    if (publicRoutes.includes(operation)) {
      return [];
    }
    return [options.authenticate, ...protectedMiddleware];
  };

  const rejectIfUnauthorized = (req: Request, res: Response, operation: CrudOperation): boolean => {
    const error = options.authorize?.(req, operation);
    if (!error) return false;
    handleResult(res, err(error));
    return true;
  };

  router.post('/batch', ...guard('createMany'), async (req: Request, res: Response) => {
    if (rejectIfUnauthorized(req, res, 'createMany')) return;
    const result = await service.createMany(req.body);
    handleResult(res, result, 201);
  });

  router.post('/query', ...guard('readMany'), async (req: Request, res: Response) => {
    if (rejectIfUnauthorized(req, res, 'readMany')) return;
    const result = await service.readMany(req.body.ids);
    handleResult(res, result);
  });

  router.put('/batch', ...guard('updateMany'), async (req: Request, res: Response) => {
    if (rejectIfUnauthorized(req, res, 'updateMany')) return;
    const result = await service.updateMany(req.body);
    handleResult(res, result);
  });

  router.delete('/batch', ...guard('deleteMany'), async (req: Request, res: Response) => {
    if (rejectIfUnauthorized(req, res, 'deleteMany')) return;
    const result = await service.deleteMany(req.body.ids);
    handleResult(res, result);
  });

  router.post('/', ...guard('createOne'), async (req: Request, res: Response) => {
    if (rejectIfUnauthorized(req, res, 'createOne')) return;
    const result = await service.createOne(req.body);
    handleResult(res, result, 201);
  });

  router.get('/', ...guard('readAll'), async (req: Request, res: Response) => {
    if (rejectIfUnauthorized(req, res, 'readAll')) return;
    const page = req.query['page'] ? parseInt(req.query['page'] as string, 10) : 1;
    const limit = req.query['limit'] ? parseInt(req.query['limit'] as string, 10) : 25;
    const field = typeof req.query['field'] === 'string' ? req.query['field'] : undefined;
    const search = typeof req.query['search'] === 'string' ? req.query['search'] : undefined;
    const fieldType = typeof req.query['fieldType'] === 'string' ? req.query['fieldType'] : undefined;
    const filter =
      field && search && options.searchableFields?.includes(field)
        ? { [field]: buildSearchFilterValue(search, fieldType) }
        : undefined;
    const result = await service.readAll(page, limit, filter);
    handleResult(res, result);
  });

  router.get('/:id', ...guard('readOne'), async (req: Request, res: Response) => {
    if (rejectIfUnauthorized(req, res, 'readOne')) return;
    const id = String(req.params['id']);
    const result = await service.readOne(id);
    handleResult(res, result);
  });

  router.put('/:id', ...guard('updateOne'), async (req: Request, res: Response) => {
    if (rejectIfUnauthorized(req, res, 'updateOne')) return;
    const id = String(req.params['id']);
    const result = await service.updateOne(id, req.body);
    handleResult(res, result);
  });

  router.delete('/:id', ...guard('deleteOne'), async (req: Request, res: Response) => {
    if (rejectIfUnauthorized(req, res, 'deleteOne')) return;
    const id = String(req.params['id']);
    const result = await service.deleteOne(id);
    handleResult(res, result.map(() => ({ id, deleted: true })), 200);
  });

  return router;
};

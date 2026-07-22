import { Router, Request, Response, RequestHandler } from 'express';
import { Result } from 'neverthrow';
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
}

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

  router.post('/batch', ...guard('createMany'), async (req: Request, res: Response) => {
    const result = await service.createMany(req.body);
    handleResult(res, result, 201);
  });

  router.post('/query', ...guard('readMany'), async (req: Request, res: Response) => {
    const result = await service.readMany(req.body.ids);
    handleResult(res, result);
  });

  router.put('/batch', ...guard('updateMany'), async (req: Request, res: Response) => {
    const result = await service.updateMany(req.body);
    handleResult(res, result);
  });

  router.delete('/batch', ...guard('deleteMany'), async (req: Request, res: Response) => {
    const result = await service.deleteMany(req.body.ids);
    handleResult(res, result);
  });

  router.post('/', ...guard('createOne'), async (req: Request, res: Response) => {
    const result = await service.createOne(req.body);
    handleResult(res, result, 201);
  });

  router.get('/', ...guard('readAll'), async (req: Request, res: Response) => {
    const page = req.query['page'] ? parseInt(req.query['page'] as string, 10) : 1;
    const limit = req.query['limit'] ? parseInt(req.query['limit'] as string, 10) : 25;
    const result = await service.readAll(page, limit);
    handleResult(res, result);
  });

  router.get('/:id', ...guard('readOne'), async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const result = await service.readOne(id);
    handleResult(res, result);
  });

  router.put('/:id', ...guard('updateOne'), async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const result = await service.updateOne(id, req.body);
    handleResult(res, result);
  });

  router.delete('/:id', ...guard('deleteOne'), async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const result = await service.deleteOne(id);
    handleResult(res, result.map(() => ({ id, deleted: true })), 200);
  });

  return router;
};

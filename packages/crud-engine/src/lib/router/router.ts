import { Router, Request, Response } from 'express';
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
          : error.type === 'NOT_FOUND_ERROR'
          ? 404
          : error.type === 'CONFLICT_ERROR'
          ? 409
          : 500;
      res.status(statusCode).json({ success: false, error });
    }
  );
};

export const createCrudRouter = <T extends BaseEntity, CreateDTO, UpdateDTO>(
  service: CrudService<T, CreateDTO, UpdateDTO>
): Router => {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    const result = await service.createOne(req.body);
    handleResult(res, result, 201);
  });

  router.post('/batch', async (req: Request, res: Response) => {
    const result = await service.createMany(req.body);
    handleResult(res, result, 201);
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const result = await service.readOne(id);
    handleResult(res, result);
  });

  router.post('/query', async (req: Request, res: Response) => {
    const result = await service.readMany(req.body.ids);
    handleResult(res, result);
  });

  router.get('/', async (req: Request, res: Response) => {
    const page = req.query['page'] ? parseInt(req.query['page'] as string, 10) : 1;
    const limit = req.query['limit'] ? parseInt(req.query['limit'] as string, 10) : 25;
    const result = await service.readAll(page, limit);
    handleResult(res, result);
  });

  router.put('/:id', async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const result = await service.updateOne(id, req.body);
    handleResult(res, result);
  });

  router.put('/batch', async (req: Request, res: Response) => {
    const result = await service.updateMany(req.body);
    handleResult(res, result);
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const result = await service.deleteOne(id);
    handleResult(res, result, 204);
  });

  router.delete('/batch', async (req: Request, res: Response) => {
    const result = await service.deleteMany(req.body.ids);
    handleResult(res, result);
  });

  return router;
};
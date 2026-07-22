import { Router, Request, Response, RequestHandler } from 'express';
import { handleResult } from '@inithium/crud-engine';
import { FileManagerService } from '@inithium/file-manager';

export interface FilesRouterConfig {
  readonly authenticate: RequestHandler;
  readonly requireAdmin: RequestHandler;
}

export const createFilesRouter = (fileManagerService: FileManagerService, config: FilesRouterConfig): Router => {
  const router = Router();

  router.use(config.authenticate, config.requireAdmin);

  router.post('/', async (req: Request, res: Response) => {
    const result = await fileManagerService.createFile(req.body);
    handleResult(res, result, 201);
  });

  router.put('/', async (req: Request, res: Response) => {
    const result = await fileManagerService.updateFile(req.body);
    handleResult(res, result);
  });

  router.delete('/', async (req: Request, res: Response) => {
    const result = await fileManagerService.deleteFile(req.body);
    handleResult(res, result);
  });

  router.patch('/move', async (req: Request, res: Response) => {
    const result = await fileManagerService.moveFile(req.body);
    handleResult(res, result);
  });

  return router;
};
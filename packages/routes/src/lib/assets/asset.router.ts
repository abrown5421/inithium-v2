import fs from 'node:fs';
import { Router, Request, Response, RequestHandler } from 'express';
import multer, { MulterError } from 'multer';
import '@inithium/auth';
import { handleResult } from '@inithium/crud-engine';
import { AssetService } from '../../../../services/src/lib/assets/asset.service.js';

export interface AssetRouterConfig {
  readonly authenticate: RequestHandler;
  readonly requireAdmin: RequestHandler;
  readonly maxUploadSizeMb: number;
}

const isAdminRole = (role: string): boolean => role === 'admin' || role === 'super-admin';

const parseIsSystem = (file: Express.Multer.File | undefined, body: Record<string, unknown> | undefined): boolean =>
  file
    ? body?.isSystem === 'true' || body?.isSystem === true
    : Boolean(body?.isSystem);

const extractFilePayload = (file: Express.Multer.File | undefined, body: Record<string, unknown> | undefined) => ({
  fileContentBase64: (file ? file.buffer.toString('base64') : body?.fileContent) as string | undefined,
  originalName: (file ? file.originalname : body?.originalName) as string | undefined,
  mimeType: (file ? file.mimetype : body?.mimeType) as string | undefined
});

const buildUploadMiddleware = (maxUploadSizeMb: number): RequestHandler => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxUploadSizeMb * 1024 * 1024 }
  });

  const single = upload.single('file');

  return (req, res, next) => {
    single(req, res, (error: unknown) => {
      if (!error) {
        next();
        return;
      }
      const message = error instanceof MulterError ? error.message : 'Failed to process uploaded file';
      res.status(400).json({ success: false, error: { type: 'VALIDATION_ERROR', message } });
    });
  };
};

export const createAssetRouter = (assetService: AssetService, config: AssetRouterConfig): Router => {
  const router = Router();
  const uploadMiddleware = buildUploadMiddleware(config.maxUploadSizeMb);

  router.post('/', config.authenticate, uploadMiddleware, async (req: Request, res: Response) => {
    const requesterIsAdmin = isAdminRole(req.user!.role);
    const requestedIsSystem = parseIsSystem(req.file, req.body);

    if (requestedIsSystem && !requesterIsAdmin) {
      res.status(403).json({
        success: false,
        error: { type: 'FORBIDDEN_ERROR', message: 'Only administrators can upload system assets' }
      });
      return;
    }

    const { fileContentBase64, originalName, mimeType } = extractFilePayload(req.file, req.body);

    if (!fileContentBase64 || !originalName || !mimeType) {
      res.status(400).json({
        success: false,
        error: { type: 'VALIDATION_ERROR', message: 'Missing required asset file content or metadata' }
      });
      return;
    }

    const result = await assetService.uploadAsset({
      fileContentBase64,
      originalName,
      mimeType,
      isSystem: requestedIsSystem,
      userId: req.user!.id
    });
    handleResult(res, result, 201);
  });

  router.get('/by-key/:key', async (req: Request, res: Response) => {
    const result = await assetService.getAssetFileStreamByKey(String(req.params['key']));

    result.match(
      ({ filePath, mimeType }) => {
        res.setHeader('Content-Type', mimeType);
        const stream = fs.createReadStream(filePath);
        stream.on('error', () => {
          if (!res.headersSent) {
            res.status(500).json({ success: false, error: { type: 'INTERNAL_ERROR', message: 'Failed to stream file' } });
          }
        });
        stream.pipe(res);
      },
      (error) => {
        const statusCode = error.type === 'NOT_FOUND_ERROR' ? 404 : error.type === 'VALIDATION_ERROR' ? 400 : 500;
        res.status(statusCode).json({ success: false, error });
      }
    );
  });

  router.delete('/by-key/:key', config.authenticate, async (req: Request, res: Response) => {
    const key = String(req.params['key']);
    const result = await assetService.deleteAssetByKey(key, req.user!.id, isAdminRole(req.user!.role)); 
    handleResult(res, result.map(() => ({ key, deleted: true })));
  });

  router.get('/', config.authenticate, config.requireAdmin, async (req: Request, res: Response) => {
    const page = req.query['page'] ? parseInt(req.query['page'] as string, 10) : 1;
    const limit = req.query['limit'] ? parseInt(req.query['limit'] as string, 10) : 25;
    const result = await assetService.readAll(page, limit);
    handleResult(res, result);
  });

  router.get('/:id', config.authenticate, config.requireAdmin, async (req: Request, res: Response) => {
    const result = await assetService.readOne(String(req.params['id']));
    handleResult(res, result);
  });

  router.put('/:id', config.authenticate, config.requireAdmin, async (req: Request, res: Response) => {
    const result = await assetService.updateOne(String(req.params['id']), req.body);
    handleResult(res, result);
  });

  return router;
};
import fs from 'node:fs';
import { Router, Request, Response, RequestHandler } from 'express';
import multer, { MulterError } from 'multer';
import { createRequireRoleMiddleware } from '@inithium/auth';
import { buildSearchFilterValue, handleResult } from '@inithium/crud-engine';
import {
  ASSET_EDITABLE_FIELDS,
  ASSET_PERMISSION_MATRIX,
  UserRole,
  canAssignAssetIsSystem,
  canPerformAssetAction,
  getDisallowedFields
} from '@inithium/types';
import { AssetService, UserService } from '@inithium/services';

export interface AssetRouterConfig {
  readonly authenticate: RequestHandler;
  readonly maxUploadSizeMb: number;
  /** Used to validate an `onBehalfOfUserId` upload target actually exists before attributing the asset to it. */
  readonly userService: UserService;
}

/** Roles allowed into the CMS at all — everyone gets read access to the whole asset library. */
const CMS_ROLES: readonly UserRole[] = ['super-admin', 'admin', 'editor', 'writer'];
const SEARCHABLE_FIELDS = ['originalName', 'isSystem', 'category'];

const isAdminRole = (role: string): boolean => role === 'admin' || role === 'super-admin';

const parseIsSystem = (file: Express.Multer.File | undefined, body: Record<string, unknown> | undefined): boolean =>
  file ? body?.isSystem === 'true' || body?.isSystem === true : Boolean(body?.isSystem);

const extractFilePayload = (file: Express.Multer.File | undefined, body: Record<string, unknown> | undefined) => ({
  fileContentBase64: (file ? file.buffer.toString('base64') : body?.fileContent) as string | undefined,
  originalName: (file ? file.originalname : body?.originalName) as string | undefined,
  mimeType: (file ? file.mimetype : body?.mimeType) as string | undefined
});

export const buildUploadMiddleware = (maxUploadSizeMb: number): RequestHandler => {
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
      const message =
        error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE'
          ? `File exceeds the maximum upload size of ${maxUploadSizeMb}MB`
          : error instanceof MulterError
            ? error.message
            : 'Failed to process uploaded file';
      res.status(400).json({ success: false, error: { type: 'VALIDATION_ERROR', message } });
    });
  };
};

/** One year, matching the `immutable` directive below — assets are stored under a random content key that only changes on re-upload, so a cached response never goes stale under normal use. */
const ASSET_CACHE_CONTROL = 'public, max-age=31536000, immutable';

const buildAssetETag = (key: string, sizeBytes: number, updatedAt: Date): string =>
  `"${key}-${sizeBytes}-${updatedAt.getTime()}"`;

export const createAssetRouter = (assetService: AssetService, config: AssetRouterConfig): Router => {
  const router = Router();
  const uploadMiddleware = buildUploadMiddleware(config.maxUploadSizeMb);
  const requireCmsRole = createRequireRoleMiddleware(CMS_ROLES);

  router.post('/', config.authenticate, uploadMiddleware, async (req: Request, res: Response) => {
    const role = req.user!.role;

    if (!canPerformAssetAction(role, 'create')) {
      res.status(403).json({ success: false, error: { type: 'FORBIDDEN_ERROR', message: 'You are not allowed to upload assets' } });
      return;
    }

    const requestedIsSystem = parseIsSystem(req.file, req.body);
    const isSystemValue: 'true' | 'false' = requestedIsSystem ? 'true' : 'false';
    const onBehalfOfUserId =
      typeof req.body?.onBehalfOfUserId === 'string' && req.body.onBehalfOfUserId.length > 0
        ? req.body.onBehalfOfUserId
        : undefined;

    const payload: Record<string, unknown> = {
      isSystem: isSystemValue,
      ...(onBehalfOfUserId ? { onBehalfOfUserId } : {})
    };

    const disallowedFields = getDisallowedFields(ASSET_PERMISSION_MATRIX, role, payload, ASSET_EDITABLE_FIELDS);
    if (disallowedFields.length > 0) {
      res.status(403).json({
        success: false,
        error: { type: 'FORBIDDEN_ERROR', message: `You are not allowed to set: ${disallowedFields.join(', ')}` }
      });
      return;
    }

    if (!canAssignAssetIsSystem(role, isSystemValue)) {
      res.status(403).json({
        success: false,
        error: { type: 'FORBIDDEN_ERROR', message: 'You are not allowed to upload this type of asset' }
      });
      return;
    }

    if (onBehalfOfUserId) {
      const targetUserResult = await config.userService.readOne(onBehalfOfUserId);
      if (targetUserResult.isErr()) {
        handleResult(res, targetUserResult);
        return;
      }
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
      userId: onBehalfOfUserId ?? req.user!.id
    });
    handleResult(res, result, 201);
  });

  router.get('/by-key/:key', async (req: Request, res: Response) => {
    const key = String(req.params['key']);
    const result = await assetService.getAssetFileStreamByKey(key);

    result.match(
      ({ filePath, mimeType, sizeBytes, updatedAt }) => {
        const etag = buildAssetETag(key, sizeBytes, updatedAt);

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', sizeBytes);
        res.setHeader('Cache-Control', ASSET_CACHE_CONTROL);
        res.setHeader('ETag', etag);
        res.setHeader('Last-Modified', updatedAt.toUTCString());

        if (req.headers['if-none-match'] === etag) {
          res.status(304).end();
          return;
        }

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

  router.delete('/batch', config.authenticate, requireCmsRole, async (req: Request, res: Response) => {
    const role = req.user!.role;
    if (!canPerformAssetAction(role, 'delete')) {
      res.status(403).json({ success: false, error: { type: 'FORBIDDEN_ERROR', message: 'You are not allowed to delete assets' } });
      return;
    }

    const keys: readonly unknown[] = Array.isArray(req.body?.keys) ? req.body.keys : [];
    let deletedCount = 0;
    for (const key of keys) {
      const result = await assetService.deleteAssetByKey(String(key), req.user!.id, isAdminRole(role));
      if (result.isOk()) deletedCount += 1;
    }
    res.status(200).json({ success: true, data: deletedCount });
  });

  router.delete('/by-key/:key', config.authenticate, requireCmsRole, async (req: Request, res: Response) => {
    const role = req.user!.role;
    if (!canPerformAssetAction(role, 'delete')) {
      res.status(403).json({ success: false, error: { type: 'FORBIDDEN_ERROR', message: 'You are not allowed to delete assets' } });
      return;
    }

    const key = String(req.params['key']);
    const result = await assetService.deleteAssetByKey(key, req.user!.id, isAdminRole(role));
    handleResult(res, result.map(() => ({ key, deleted: true })));
  });

  router.get('/', config.authenticate, requireCmsRole, async (req: Request, res: Response) => {
    const page = req.query['page'] ? parseInt(req.query['page'] as string, 10) : 1;
    const limit = req.query['limit'] ? parseInt(req.query['limit'] as string, 10) : 25;
    const field = typeof req.query['field'] === 'string' ? req.query['field'] : undefined;
    const search = typeof req.query['search'] === 'string' ? req.query['search'] : undefined;
    const fieldType = typeof req.query['fieldType'] === 'string' ? req.query['fieldType'] : undefined;
    const filter =
      field && search && SEARCHABLE_FIELDS.includes(field)
        ? { [field]: buildSearchFilterValue(search, fieldType) }
        : undefined;
    const result = await assetService.readAll(page, limit, filter);
    handleResult(res, result);
  });

  router.get('/:id', config.authenticate, requireCmsRole, async (req: Request, res: Response) => {
    const result = await assetService.readOne(String(req.params['id']));
    handleResult(res, result);
  });

  router.put('/:id', config.authenticate, requireCmsRole, async (req: Request, res: Response) => {
    const role = req.user!.role;
    if (!canPerformAssetAction(role, 'update')) {
      res.status(403).json({ success: false, error: { type: 'FORBIDDEN_ERROR', message: 'You are not allowed to edit assets' } });
      return;
    }

    const id = String(req.params['id']);

    if (role === 'editor') {
      const existingResult = await assetService.readOne(id);
      if (existingResult.isErr()) {
        handleResult(res, existingResult);
        return;
      }
      if (!existingResult.value.isSystem) {
        res.status(403).json({
          success: false,
          error: { type: 'FORBIDDEN_ERROR', message: 'You can only rename system assets' }
        });
        return;
      }
    }

    const result = await assetService.updateOne(id, req.body);
    handleResult(res, result);
  });

  router.put('/:id/file', config.authenticate, uploadMiddleware, async (req: Request, res: Response) => {
    const role = req.user!.role;
    if (!canPerformAssetAction(role, 'update')) {
      res.status(403).json({ success: false, error: { type: 'FORBIDDEN_ERROR', message: 'You are not allowed to edit assets' } });
      return;
    }

    const id = String(req.params['id']);

    if (role === 'editor') {
      const existingResult = await assetService.readOne(id);
      if (existingResult.isErr()) {
        handleResult(res, existingResult);
        return;
      }
      if (!existingResult.value.isSystem) {
        res.status(403).json({
          success: false,
          error: { type: 'FORBIDDEN_ERROR', message: 'You can only replace the file for system assets' }
        });
        return;
      }
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        error: { type: 'VALIDATION_ERROR', message: 'A replacement file is required' }
      });
      return;
    }

    const result = await assetService.replaceAssetFile(id, {
      fileContentBase64: req.file.buffer.toString('base64'),
      fileName: req.file.originalname,
      mimeType: req.file.mimetype
    });
    handleResult(res, result);
  });

  return router;
};

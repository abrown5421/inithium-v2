import { Router, RequestHandler } from 'express';
import { handleResult } from '@inithium/crud-engine';
import { AssetService } from '@inithium/services';
import { buildUploadMiddleware } from '../assets/asset.router.js';

export interface ProfileImageUploadRouterConfig {
  readonly authenticate: RequestHandler;
  readonly maxUploadSizeMb: number;
}

const ALLOWED_PROFILE_IMAGE_MIME_TYPES: ReadonlySet<string> = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif'
]);

export const createProfileImageUploadRouter = (
  assetService: AssetService,
  config: ProfileImageUploadRouterConfig
): Router => {
  const router = Router();
  const uploadMiddleware = buildUploadMiddleware(config.maxUploadSizeMb);

  router.post('/', config.authenticate, uploadMiddleware, async (req, res) => {
    if (!req.file) {
      res.status(400).json({ success: false, error: { type: 'VALIDATION_ERROR', message: 'An image file is required' } });
      return;
    }
    if (!ALLOWED_PROFILE_IMAGE_MIME_TYPES.has(req.file.mimetype)) {
      res.status(400).json({
        success: false,
        error: { type: 'VALIDATION_ERROR', message: 'Only PNG, JPEG, WebP, or GIF images are allowed' }
      });
      return;
    }

    const result = await assetService.uploadAsset({
      fileContentBase64: req.file.buffer.toString('base64'),
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      userId: req.user!.id,
      isSystem: false
    });
    handleResult(res, result, 201);
  });

  router.delete('/:key', config.authenticate, async (req, res) => {
    const key = String(req.params['key']);
    const result = await assetService.deleteAssetByKey(key, req.user!.id, false);
    handleResult(res, result.map(() => ({ key, deleted: true })));
  });

  return router;
};

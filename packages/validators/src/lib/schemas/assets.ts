import { z } from 'zod';

export const assetCategorySchema = z.enum(['images', 'pdfs', 'videos', 'audio', 'other']);

export const createAssetSchema = z.object({
  key: z.string().min(1),
  originalName: z.string().min(1),
  filePath: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  uploadedBy: z.string().min(1),
  isSystem: z.boolean()
});

export const uploadAssetInputSchema = z.object({
  fileContentBase64: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  isSystem: z.boolean().optional().default(false)
});

export const updateAssetSchema = z.object({
  originalName: z.string().min(1).optional()
});

export type CreateAssetDTO = z.infer<typeof createAssetSchema>;
export type UploadAssetInputDTO = z.infer<typeof uploadAssetInputSchema>;
export type UpdateAssetDTO = z.infer<typeof updateAssetSchema>;
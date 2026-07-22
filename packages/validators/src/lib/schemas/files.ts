import { z } from 'zod';

export const createFileSchema = z.object({
  filePath: z.string().min(1),
  fileContent: z.string().min(1)
});

export const updateFileSchema = createFileSchema;

export const deleteFileSchema = z.object({
  filePath: z.string().min(1)
});

export const moveFileSchema = z.object({
  sourcePath: z.string().min(1),
  targetPath: z.string().min(1)
});

export type CreateFileDTO = z.infer<typeof createFileSchema>;
export type UpdateFileDTO = z.infer<typeof updateFileSchema>;
export type DeleteFileDTO = z.infer<typeof deleteFileSchema>;
export type MoveFileDTO = z.infer<typeof moveFileSchema>;
import { z } from 'zod';

export const baseEntitySchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const paginationQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 25))
});
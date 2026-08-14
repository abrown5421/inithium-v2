import { z } from 'zod';

export const reportErrorLogSchema = z.object({
  message: z.string().min(1).max(2000),
  stack: z.string().max(8000).optional(),
  appId: z.string().min(1).max(40),
  route: z.string().min(1).max(500),
  userAgent: z.string().max(500).optional(),
  userId: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional()
});

export type ReportErrorLogDTO = z.infer<typeof reportErrorLogSchema>;

export const errorLogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  appId: z.string().min(1).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional()
});

export type ErrorLogQueryDTO = z.infer<typeof errorLogQuerySchema>;

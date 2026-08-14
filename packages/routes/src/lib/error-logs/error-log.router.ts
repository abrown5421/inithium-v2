import { Router, Request, Response, RequestHandler } from 'express';
import { err } from 'neverthrow';
import { handleResult } from '@inithium/crud-engine';
import { createValidationError } from '@inithium/types';
import { errorLogQuerySchema, reportErrorLogSchema } from '@inithium/validators';
import { ErrorLogService } from '@inithium/services';

export interface ErrorLogRouterConfig {
  readonly authenticate: RequestHandler;
  readonly requireCmsRole: RequestHandler;
  readonly ingestRateLimit: RequestHandler;
}

export const createErrorLogRouter = (service: ErrorLogService, config: ErrorLogRouterConfig): Router => {
  const router = Router();

  router.post('/', config.ingestRateLimit, async (req: Request, res: Response) => {
    const parsed = reportErrorLogSchema.safeParse(req.body);
    if (!parsed.success) {
      handleResult(res, err(createValidationError('Invalid error report payload', parsed.error.issues)));
      return;
    }
    const result = await service.reportError(parsed.data);
    handleResult(res, result, 202);
  });

  router.get('/', config.authenticate, config.requireCmsRole, async (req: Request, res: Response) => {
    const parsed = errorLogQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      handleResult(res, err(createValidationError('Invalid error log query parameters', parsed.error.issues)));
      return;
    }
    const result = await service.listErrorLogs(parsed.data);
    handleResult(res, result);
  });

  return router;
};

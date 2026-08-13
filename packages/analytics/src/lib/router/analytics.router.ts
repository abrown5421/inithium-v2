import { Router, Request, Response, RequestHandler } from 'express';
import { err } from 'neverthrow';
import { handleResult } from '@inithium/crud-engine';
import { createValidationError } from '@inithium/types';
import { timeSeriesQuerySchema } from '@inithium/validators';
import { TimeSeriesAggregationService } from '../aggregation/time-series-aggregation.js';
import { ReportableCollectionsResolver } from '../reportable-collections/reportable-collections.js';

export interface AnalyticsRouterConfig {
  readonly authenticate: RequestHandler;
  readonly requireCmsRole: RequestHandler;
  readonly timeSeriesService: TimeSeriesAggregationService;
  readonly reportableCollectionsResolver: ReportableCollectionsResolver;
}

export const createAnalyticsRouter = (config: AnalyticsRouterConfig): Router => {
  const router = Router();
  const guard: readonly RequestHandler[] = [config.authenticate, config.requireCmsRole];

  router.get('/reportable-collections', ...guard, async (_req: Request, res: Response) => {
    const result = await config.reportableCollectionsResolver.listAll();
    handleResult(res, result);
  });

  router.get('/time-series', ...guard, async (req: Request, res: Response) => {
    const parsed = timeSeriesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      handleResult(res, err(createValidationError('Invalid time series query parameters', parsed.error.issues)));
      return;
    }

    const allowedResult = await config.reportableCollectionsResolver.isAllowed(parsed.data.collectionName);
    if (allowedResult.isErr()) {
      handleResult(res, err(allowedResult.error));
      return;
    }
    if (!allowedResult.value) {
      handleResult(res, err(createValidationError('Collection is not available for reporting')));
      return;
    }

    const result = await config.timeSeriesService.getTimeSeries(parsed.data);
    handleResult(res, result);
  });

  return router;
};

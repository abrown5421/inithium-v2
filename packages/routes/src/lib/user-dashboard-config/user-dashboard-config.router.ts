import { Router, Request, Response, RequestHandler } from 'express';
import { err } from 'neverthrow';
import { createCrudRouter, handleResult, CrudOperation } from '@inithium/crud-engine';
import { UserDashboardConfigService } from '@inithium/services';
import { ReportableCollectionsResolver } from '@inithium/analytics';
import { AppError, createForbiddenError, createValidationError } from '@inithium/types';

export interface UserDashboardConfigRouterConfig {
  readonly authenticate: RequestHandler;
  readonly reportableCollectionsResolver: ReportableCollectionsResolver;
}

const checkOwnership = async (
  service: UserDashboardConfigService,
  id: string,
  req: Request
): Promise<AppError | undefined> => {
  const existing = await service.readOne(id);
  if (existing.isErr()) return existing.error;
  return existing.value.userId === req.user!.id
    ? undefined
    : createForbiddenError('You can only access your own dashboard configuration');
};

const collectTargetCollections = (body: unknown): readonly string[] => {
  if (typeof body !== 'object' || body === null || !('widgets' in body)) return [];
  const widgets = (body as { widgets?: unknown }).widgets;
  if (!Array.isArray(widgets)) return [];
  return widgets
    .map((widget) =>
      typeof widget === 'object' && widget !== null
        ? (widget as { config?: { targetCollection?: unknown } }).config?.targetCollection
        : undefined
    )
    .filter((value): value is string => typeof value === 'string');
};

const validateTargetCollections = async (
  body: unknown,
  resolver: ReportableCollectionsResolver
): Promise<AppError | undefined> => {
  for (const collectionName of collectTargetCollections(body)) {
    const allowedResult = await resolver.isAllowed(collectionName);
    if (allowedResult.isErr()) return allowedResult.error;
    if (!allowedResult.value) return createValidationError(`Collection "${collectionName}" is not available for reporting`);
  }
  return undefined;
};

const authorizeRemainingOperations = (req: Request, operation: CrudOperation): AppError | undefined => {
  if (operation === 'readAll') {
    return req.query['field'] === 'userId' && req.query['search'] === req.user!.id
      ? undefined
      : createForbiddenError('You can only list your own dashboard configuration');
  }
  return createForbiddenError('Operation not supported for dashboard configuration');
};

export const createUserDashboardConfigRouter = (
  service: UserDashboardConfigService,
  config: UserDashboardConfigRouterConfig
): Router => {
  const router = Router();

  router.post('/', config.authenticate, async (req: Request, res: Response) => {
    const collectionError = await validateTargetCollections(req.body, config.reportableCollectionsResolver);
    if (collectionError) {
      handleResult(res, err(collectionError));
      return;
    }
    const result = await service.createOne({ ...req.body, userId: req.user!.id });
    handleResult(res, result, 201);
  });

  router.get('/:id', config.authenticate, async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const ownershipError = await checkOwnership(service, id, req);
    if (ownershipError) {
      handleResult(res, err(ownershipError));
      return;
    }
    const result = await service.readOne(id);
    handleResult(res, result);
  });

  router.put('/:id', config.authenticate, async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const ownershipError = await checkOwnership(service, id, req);
    if (ownershipError) {
      handleResult(res, err(ownershipError));
      return;
    }
    const collectionError = await validateTargetCollections(req.body, config.reportableCollectionsResolver);
    if (collectionError) {
      handleResult(res, err(collectionError));
      return;
    }
    const result = await service.updateOne(id, req.body);
    handleResult(res, result);
  });

  router.delete('/:id', config.authenticate, async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const ownershipError = await checkOwnership(service, id, req);
    if (ownershipError) {
      handleResult(res, err(ownershipError));
      return;
    }
    const result = await service.deleteOne(id);
    handleResult(
      res,
      result.map(() => ({ id, deleted: true }))
    );
  });

  router.use(
    createCrudRouter(service, {
      authenticate: config.authenticate,
      publicRoutes: [],
      searchableFields: ['userId'],
      authorize: authorizeRemainingOperations
    })
  );

  return router;
};

import { Router, Request, Response, RequestHandler } from 'express';
import { err } from 'neverthrow';
import { createCrudRouter, handleResult } from '@inithium/crud-engine';
import { ProfileService } from '@inithium/services';
import { AppError, CMS_ROLES, createForbiddenError } from '@inithium/types';

export interface ProfileRouterConfig {
  readonly authenticate: RequestHandler;
}

const checkOwnershipOrCmsRole = async (
  profileService: ProfileService,
  id: string,
  req: Request
): Promise<AppError | undefined> => {
  const existing = await profileService.readOne(id);
  if (existing.isErr()) return existing.error;

  const isOwner = existing.value.user_id === req.user!.id;
  const isCmsRole = CMS_ROLES.includes(req.user!.role);
  return isOwner || isCmsRole ? undefined : createForbiddenError('You can only modify your own profile');
};

export const createProfileRouter = (profileService: ProfileService, config: ProfileRouterConfig): Router => {
  const router = Router();

  router.post('/', config.authenticate, async (req: Request, res: Response) => {
    const result = await profileService.createOne({ ...req.body, user_id: req.user!.id });
    handleResult(res, result, 201);
  });

  router.put('/:id', config.authenticate, async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const authError = await checkOwnershipOrCmsRole(profileService, id, req);
    if (authError) {
      handleResult(res, err(authError));
      return;
    }
    const result = await profileService.updateOne(id, req.body);
    handleResult(res, result);
  });

  router.delete('/:id', config.authenticate, async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const authError = await checkOwnershipOrCmsRole(profileService, id, req);
    if (authError) {
      handleResult(res, err(authError));
      return;
    }
    const result = await profileService.deleteOne(id);
    handleResult(res, result.map(() => ({ id, deleted: true })));
  });

  router.use(
    createCrudRouter(profileService, {
      authenticate: config.authenticate,
      publicRoutes: [],
      searchableFields: ['user_id']
    })
  );

  return router;
};

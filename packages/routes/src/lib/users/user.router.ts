import { Router, RequestHandler } from 'express';
import { createCrudRouter } from '@inithium/crud-engine';
import { UserService } from '@inithium/services';

export interface UserRouterConfig {
  readonly authenticate: RequestHandler;
  readonly requireAdmin: RequestHandler;
}

export const createUserRouter = (userService: UserService, config: UserRouterConfig): Router => {
  return createCrudRouter(userService, {
    authenticate: config.authenticate,
    publicRoutes: [],
    protectedMiddleware: [config.requireAdmin]
  });
};

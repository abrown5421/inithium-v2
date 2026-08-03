import { Db } from 'mongodb';
import { Router, RequestHandler } from 'express';
import { createRepository } from '@inithium/crud-engine';
import { createUserService, UserService } from '@inithium/services';
import { createUserRouter } from '@inithium/routes';
import { User } from '@inithium/models';

export interface UserCollectionConfig {
  readonly authenticate: RequestHandler;
}

export interface UserCollection {
  readonly service: UserService;
  readonly router: Router;
}

export const createUserCollection = (db: Db, config: UserCollectionConfig): UserCollection => {
  const repository = createRepository<User>(db, 'users');
  const service = createUserService(repository);
  const router = createUserRouter(service, { authenticate: config.authenticate });
  return { service, router };
};

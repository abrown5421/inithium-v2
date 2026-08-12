import { Db } from 'mongodb';
import { Router, RequestHandler } from 'express';
import { createRepository } from '@inithium/crud-engine';
import { createProfileService, ProfileService } from '@inithium/services';
import { createProfileRouter } from '@inithium/routes';
import { Profile } from '@inithium/models';

export interface ProfileCollectionConfig {
  readonly authenticate: RequestHandler;
}

export interface ProfileCollection {
  readonly service: ProfileService;
  readonly router: Router;
}

export const createProfileCollection = (db: Db, config: ProfileCollectionConfig): ProfileCollection => {
  const repository = createRepository<Profile>(db, 'profiles');
  const service = createProfileService(repository);
  const router = createProfileRouter(service, { authenticate: config.authenticate });
  return { service, router };
};

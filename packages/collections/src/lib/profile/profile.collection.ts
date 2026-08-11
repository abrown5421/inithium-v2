import { Db } from 'mongodb';
import { Router } from 'express';
import { createRepository, createCrudRouter, CrudRouterOptions } from '@inithium/crud-engine';
import { createProfileService, ProfileService } from '@inithium/services';
import { Profile } from '@inithium/models';

export interface ProfileCollection {
  readonly service: ProfileService;
  readonly router: Router;
}

export const createProfileCollection = (db: Db, config: CrudRouterOptions): ProfileCollection => {
  const repository = createRepository<Profile>(db, 'profiles');
  const service = createProfileService(repository);
  const router = createCrudRouter(service, config);
  return { service, router };
};

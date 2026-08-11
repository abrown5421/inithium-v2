import { CrudRepository, CrudService, createService } from '@inithium/crud-engine';
import { Profile } from '@inithium/models';
import { CreateProfileDTO, UpdateProfileDTO, createProfileSchema, updateProfileSchema } from '@inithium/validators';

export type ProfileService = CrudService<Profile, CreateProfileDTO, UpdateProfileDTO>;

export const createProfileService = (repo: CrudRepository<Profile>): ProfileService =>
  createService<Profile, CreateProfileDTO, UpdateProfileDTO>(repo, createProfileSchema, updateProfileSchema);

export const createInitialProfile = (userId: string): CreateProfileDTO => ({
  user_id: userId
});

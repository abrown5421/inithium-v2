import { CrudRepository, CrudService, createService } from '@inithium/crud-engine';
import { DEFAULT_TRIANGLIFY_CONFIG, Profile } from '@inithium/models';
import { CreateProfileDTO, UpdateProfileDTO, createProfileSchema, updateProfileSchema } from '@inithium/validators';

export type ProfileService = CrudService<Profile, CreateProfileDTO, UpdateProfileDTO>;

export const createProfileService = (repo: CrudRepository<Profile>): ProfileService =>
  createService<Profile, CreateProfileDTO, UpdateProfileDTO>(repo, createProfileSchema, updateProfileSchema);

export const createInitialProfile = (userId: string): CreateProfileDTO => ({
  user_id: userId,
  profileBanner: {
    bannerType: 'trianglify',
    trianglifyConfig: {
      ...DEFAULT_TRIANGLIFY_CONFIG,
      x_colors: [...DEFAULT_TRIANGLIFY_CONFIG.x_colors],
      y_colors: [...DEFAULT_TRIANGLIFY_CONFIG.y_colors]
    }
  }
});

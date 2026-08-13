import { CrudRepository, CrudService, createService } from '@inithium/crud-engine';
import { UserDashboardConfig } from '@inithium/models';
import {
  CreateUserDashboardConfigDTO,
  UpdateUserDashboardConfigDTO,
  createUserDashboardConfigSchema,
  updateUserDashboardConfigSchema
} from '@inithium/validators';

export type UserDashboardConfigService = CrudService<UserDashboardConfig, CreateUserDashboardConfigDTO, UpdateUserDashboardConfigDTO>;

export const createUserDashboardConfigService = (repo: CrudRepository<UserDashboardConfig>): UserDashboardConfigService =>
  createService<UserDashboardConfig, CreateUserDashboardConfigDTO, UpdateUserDashboardConfigDTO>(
    repo,
    createUserDashboardConfigSchema,
    updateUserDashboardConfigSchema
  );

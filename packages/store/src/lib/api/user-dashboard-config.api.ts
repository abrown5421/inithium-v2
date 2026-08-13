import { createApi } from '@reduxjs/toolkit/query/react';
import type { CreateUserDashboardConfigDTO, UpdateUserDashboardConfigDTO } from '@inithium/validators';
import type { UserDashboardConfig } from '@inithium/models';
import { unwrappingBaseQuery } from './base-query.js';
import { createCrudEndpoints } from './crud-endpoints.js';

export const userDashboardConfigApi = createApi({
  reducerPath: 'userDashboardConfigApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['UserDashboardConfig'],
  endpoints: (builder) => ({
    ...createCrudEndpoints<
      UserDashboardConfig,
      CreateUserDashboardConfigDTO,
      UpdateUserDashboardConfigDTO,
      'UserDashboardConfig',
      'userDashboardConfigApi'
    >(builder, 'user-dashboard-configs', 'UserDashboardConfig')
  })
});

export const {
  useReadAllQuery: useReadAllUserDashboardConfigsQuery,
  useCreateOneMutation: useCreateUserDashboardConfigMutation,
  useUpdateOneMutation: useUpdateUserDashboardConfigMutation,
  useDeleteOneMutation: useDeleteUserDashboardConfigMutation
} = userDashboardConfigApi;

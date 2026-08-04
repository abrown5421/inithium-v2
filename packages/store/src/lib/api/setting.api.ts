import { createApi } from '@reduxjs/toolkit/query/react';
import type { CreateSettingDTO, UpdateSettingDTO } from '@inithium/validators';
import type { Setting } from '@inithium/models';
import { unwrappingBaseQuery } from './base-query.js';
import { createCrudEndpoints } from './crud-endpoints.js';

export const settingApi = createApi({
  reducerPath: 'settingApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['Setting'],
  endpoints: (builder) =>
    createCrudEndpoints<Setting, CreateSettingDTO, UpdateSettingDTO, 'Setting', 'settingApi'>(
      builder,
      'settings',
      'Setting'
    )
});

export const {
  useReadAllQuery: useReadAllSettingsQuery,
  useReadOneQuery: useReadSettingQuery,
  useReadManyQuery: useReadSettingsByIdsQuery,
  useCreateOneMutation: useCreateSettingMutation,
  useCreateManyMutation: useCreateSettingsMutation,
  useUpdateOneMutation: useUpdateSettingMutation,
  useUpdateManyMutation: useUpdateSettingsMutation,
  useDeleteOneMutation: useDeleteSettingMutation,
  useDeleteManyMutation: useDeleteSettingsMutation
} = settingApi;

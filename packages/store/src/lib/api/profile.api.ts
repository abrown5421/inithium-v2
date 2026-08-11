import { createApi } from '@reduxjs/toolkit/query/react';
import type { CreateProfileDTO, UpdateProfileDTO } from '@inithium/validators';
import type { Profile } from '@inithium/models';
import { unwrappingBaseQuery } from './base-query.js';
import { createCrudEndpoints } from './crud-endpoints.js';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['Profile'],
  endpoints: (builder) =>
    createCrudEndpoints<Profile, CreateProfileDTO, UpdateProfileDTO, 'Profile', 'profileApi'>(
      builder,
      'profiles',
      'Profile'
    )
});

export const {
  useReadAllQuery: useReadAllProfilesQuery,
  useReadOneQuery: useReadProfileQuery,
  useReadManyQuery: useReadProfilesByIdsQuery,
  useCreateOneMutation: useCreateProfileMutation,
  useCreateManyMutation: useCreateProfilesMutation,
  useUpdateOneMutation: useUpdateProfileMutation,
  useUpdateManyMutation: useUpdateProfilesMutation,
  useDeleteOneMutation: useDeleteProfileMutation,
  useDeleteManyMutation: useDeleteProfilesMutation
} = profileApi;

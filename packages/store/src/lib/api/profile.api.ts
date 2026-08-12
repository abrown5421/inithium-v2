import { createApi } from '@reduxjs/toolkit/query/react';
import type { CreateProfileDTO, UpdateProfileDTO } from '@inithium/validators';
import type { AssetWithUrl, Profile } from '@inithium/models';
import { unwrappingBaseQuery } from './base-query.js';
import { createCrudEndpoints } from './crud-endpoints.js';

const buildBannerImageFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['Profile'],
  endpoints: (builder) => {
    const crudEndpoints = createCrudEndpoints<Profile, CreateProfileDTO, UpdateProfileDTO, 'Profile', 'profileApi'>(
      builder,
      'profiles',
      'Profile'
    );

    return {
      ...crudEndpoints,

      uploadProfileBannerImage: builder.mutation<AssetWithUrl, File>({
        query: (file) => ({ url: 'profiles/banner-image', method: 'POST', body: buildBannerImageFormData(file) })
      }),

      deleteProfileBannerImage: builder.mutation<{ key: string; deleted: boolean }, string>({
        query: (key) => ({ url: `profiles/banner-image/${key}`, method: 'DELETE' })
      })
    };
  }
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
  useDeleteManyMutation: useDeleteProfilesMutation,
  useUploadProfileBannerImageMutation,
  useDeleteProfileBannerImageMutation
} = profileApi;

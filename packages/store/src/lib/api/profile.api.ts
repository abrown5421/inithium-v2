import { createApi } from '@reduxjs/toolkit/query/react';
import type { EndpointBuilder } from '@reduxjs/toolkit/query';
import type { CreateProfileDTO, UpdateProfileDTO } from '@inithium/validators';
import type { AssetWithUrl, AvatarFont, AvatarShape, Profile, ProfileAvatar } from '@inithium/models';
import { resolveAssetUrl } from './assets.api.js';
import { unwrappingBaseQuery } from './base-query.js';
import { createCrudEndpoints } from './crud-endpoints.js';

const buildImageFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};

const buildImageUploadEndpoints = <TTagType extends string, TReducerPath extends string>(
  builder: EndpointBuilder<typeof unwrappingBaseQuery, TTagType, TReducerPath>,
  resourcePath: string
) => ({
  upload: builder.mutation<AssetWithUrl, File>({
    query: (file) => ({ url: resourcePath, method: 'POST', body: buildImageFormData(file) })
  }),
  remove: builder.mutation<{ key: string; deleted: boolean }, string>({
    query: (key) => ({ url: `${resourcePath}/${key}`, method: 'DELETE' })
  })
});

const AVATAR_FONT_CLASS_NAME: Record<AvatarFont, string> = {
  primary: 'font-primary',
  secondary: 'font-secondary',
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono'
};

const AVATAR_SHAPE_CLASS_NAME: Record<AvatarShape, string> = {
  round: 'rounded-full',
  square: 'rounded-md'
};

export interface ResolvedAvatarDisplay {
  readonly avatarSrc?: string;
  readonly avatarBackgroundColor?: string;
  readonly avatarFontColor?: string;
  readonly avatarFontClassName?: string;
  readonly avatarShapeClassName?: string;
}

export const resolveAvatarInitials = (
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null
): string | undefined => {
  const initials = [firstName, lastName]
    .filter((part): part is string => Boolean(part && part.trim().length > 0))
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
  return initials || email?.charAt(0).toUpperCase();
};

export const resolveAvatarDisplay = (avatar?: ProfileAvatar): ResolvedAvatarDisplay => {
  if (avatar?.avatarType === 'image' && avatar.avatarAssetRef) {
    return { avatarSrc: resolveAssetUrl(avatar.avatarAssetRef) };
  }
  if (avatar?.avatarType === 'custom' && avatar.customAvatarConfig) {
    const { backgroundColor, fontColor, font, shape } = avatar.customAvatarConfig;
    return {
      avatarBackgroundColor: backgroundColor,
      avatarFontColor: fontColor,
      avatarFontClassName: AVATAR_FONT_CLASS_NAME[font],
      avatarShapeClassName: AVATAR_SHAPE_CLASS_NAME[shape]
    };
  }
  return {};
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
    const bannerImageEndpoints = buildImageUploadEndpoints(builder, 'profiles/banner-image');
    const avatarImageEndpoints = buildImageUploadEndpoints(builder, 'profiles/avatar-image');

    return {
      ...crudEndpoints,

      uploadProfileBannerImage: bannerImageEndpoints.upload,
      deleteProfileBannerImage: bannerImageEndpoints.remove,

      uploadProfileAvatarImage: avatarImageEndpoints.upload,
      deleteProfileAvatarImage: avatarImageEndpoints.remove
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
  useDeleteProfileBannerImageMutation,
  useUploadProfileAvatarImageMutation,
  useDeleteProfileAvatarImageMutation
} = profileApi;

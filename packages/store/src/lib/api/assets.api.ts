// packages/store/src/lib/api/assets.api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { CreateAssetDTO, UpdateAssetDTO } from '@inithium/validators';
import type { AssetWithUrl } from '@inithium/models';
import { unwrappingBaseQuery } from './base-query.js';
import { createCrudEndpoints } from './crud-endpoints.js';

export interface UploadAssetArgs {
  readonly file: File;
  readonly isSystem?: boolean;
  /** Admin/super-admin only — attributes the upload to this user instead of the requester. */
  readonly onBehalfOfUserId?: string;
}

export interface ReplaceAssetFileArgs {
  readonly id: string;
  readonly file: File;
}

const buildUploadFormData = ({ file, isSystem, onBehalfOfUserId }: UploadAssetArgs): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  if (isSystem !== undefined) {
    formData.append('isSystem', String(isSystem));
  }
  if (onBehalfOfUserId) {
    formData.append('onBehalfOfUserId', onBehalfOfUserId);
  }
  return formData;
};

const buildReplaceFileFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};

export const assetsApi = createApi({
  reducerPath: 'assetsApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['Asset'],
  endpoints: (builder) => {
    const { readAll, readOne, updateOne } = createCrudEndpoints<
      AssetWithUrl,
      CreateAssetDTO,
      UpdateAssetDTO,
      'Asset',
      'assetsApi'
    >(builder, 'assets', 'Asset');

    return {
      readAll,
      readOne,
      updateOne,

      uploadAsset: builder.mutation<AssetWithUrl, UploadAssetArgs>({
        query: (args) => ({ url: 'assets', method: 'POST', body: buildUploadFormData(args) }),
        invalidatesTags: [{ type: 'Asset', id: 'LIST' }]
      }),

      replaceAssetFile: builder.mutation<AssetWithUrl, ReplaceAssetFileArgs>({
        query: ({ id, file }) => ({ url: `assets/${id}/file`, method: 'PUT', body: buildReplaceFileFormData(file) }),
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Asset', id }, { type: 'Asset', id: 'LIST' }]
      }),

      deleteAssetByKey: builder.mutation<{ key: string; deleted: boolean }, string>({
        query: (key) => ({ url: `assets/by-key/${key}`, method: 'DELETE' }),
        invalidatesTags: [{ type: 'Asset', id: 'LIST' }]
      }),

      deleteAssetsByKeys: builder.mutation<number, readonly string[]>({
        query: (keys) => ({ url: 'assets/batch', method: 'DELETE', body: { keys } }),
        invalidatesTags: [{ type: 'Asset', id: 'LIST' }]
      })
    };
  }
});

export const {
  useReadAllQuery: useReadAllAssetsQuery,
  useReadOneQuery: useReadAssetQuery,
  useUpdateOneMutation: useUpdateAssetMutation,
  useUploadAssetMutation,
  useReplaceAssetFileMutation,
  useDeleteAssetByKeyMutation,
  useDeleteAssetsByKeysMutation
} = assetsApi;

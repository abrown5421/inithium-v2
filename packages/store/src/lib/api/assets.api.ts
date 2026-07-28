// packages/store/src/lib/api/assets.api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { CreateAssetDTO, UpdateAssetDTO } from '@inithium/validators';
import type { AssetWithUrl } from '@inithium/models';
import { unwrappingBaseQuery } from './base-query.js';
import { createCrudEndpoints } from './crud-endpoints.js';

export interface UploadAssetArgs {
  readonly file: File;
  readonly isSystem?: boolean;
}

const buildUploadFormData = ({ file, isSystem }: UploadAssetArgs): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  if (isSystem !== undefined) {
    formData.append('isSystem', String(isSystem));
  }
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

      deleteAssetByKey: builder.mutation<{ key: string; deleted: boolean }, string>({
        query: (key) => ({ url: `assets/by-key/${key}`, method: 'DELETE' }),
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
  useDeleteAssetByKeyMutation
} = assetsApi;
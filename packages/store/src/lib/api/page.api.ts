import { createApi } from '@reduxjs/toolkit/query/react';
import type { CreatePageDTO, UpdatePageDTO } from '@inithium/validators';
import type { Page } from '@inithium/models';
import { unwrappingBaseQuery } from './base-query.js';
import { createCrudEndpoints } from './crud-endpoints.js';

export const pageApi = createApi({
  reducerPath: 'pageApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['Page'],
  endpoints: (builder) =>
    createCrudEndpoints<Page, CreatePageDTO, UpdatePageDTO, 'Page', 'pageApi'>(
      builder,
      'pages',
      'Page'
    )
});

export const {
  useReadAllQuery: useReadAllPagesQuery,
  useReadOneQuery: useReadPageQuery,
  useReadManyQuery: useReadPagesByIdsQuery,
  useCreateOneMutation: useCreatePageMutation,
  useCreateManyMutation: useCreatePagesMutation,
  useUpdateOneMutation: useUpdatePageMutation,
  useUpdateManyMutation: useUpdatePagesMutation,
  useDeleteOneMutation: useDeletePageMutation,
  useDeleteManyMutation: useDeletePagesMutation
} = pageApi;

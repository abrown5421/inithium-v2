// packages/store/src/lib/api/crud-endpoints.ts
import type { EndpointBuilder } from '@reduxjs/toolkit/query';
import type { BaseEntity, PaginatedResult } from '@inithium/types';
import type { unwrappingBaseQuery } from './base-query.js';

export interface BatchUpdateItem<TUpdateDTO> {
  readonly id: string;
  readonly data: TUpdateDTO;
}

export interface DeleteOneResult {
  readonly id: string;
  readonly deleted: boolean;
}

type CrudBaseQuery = typeof unwrappingBaseQuery;

const listTag = <TTagType extends string>(tagType: TTagType) => ({ type: tagType, id: 'LIST' as const });

export const createCrudEndpoints = 
  <TEntity extends BaseEntity,
  TCreateDTO,
  TUpdateDTO,
  TTagType extends string,
  TReducerPath extends string
>(
  builder: EndpointBuilder<CrudBaseQuery, TTagType, TReducerPath>,
  resourcePath: string,
  tagType: TTagType
) => ({
  readAll: builder.query<
    PaginatedResult<TEntity>,
    { page?: number; limit?: number; field?: string; search?: string; fieldType?: string } | void
  >({
    query: (params) => ({
      url: resourcePath,
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 25,
        ...(params?.field && params?.search
          ? { field: params.field, search: params.search, ...(params.fieldType ? { fieldType: params.fieldType } : {}) }
          : {})
      }
    }),
    providesTags: (result) =>
      result
        ? [...result.data.map(({ _id }) => ({ type: tagType, id: _id }) as const), listTag(tagType)]
        : [listTag(tagType)]
  }),

  readOne: builder.query<TEntity, string>({
    query: (id) => ({ url: `${resourcePath}/${id}` }),
    providesTags: (_result, _error, id) => [{ type: tagType, id }]
  }),

  readMany: builder.query<readonly TEntity[], readonly string[]>({
    query: (ids) => ({ url: `${resourcePath}/query`, method: 'POST', body: { ids } }),
    providesTags: (result) => (result ? result.map(({ _id }) => ({ type: tagType, id: _id }) as const) : [])
  }),

  createOne: builder.mutation<TEntity, TCreateDTO>({
    query: (body) => ({ url: resourcePath, method: 'POST', body }),
    invalidatesTags: [listTag(tagType)]
  }),

  createMany: builder.mutation<readonly TEntity[], readonly TCreateDTO[]>({
    query: (body) => ({ url: `${resourcePath}/batch`, method: 'POST', body }),
    invalidatesTags: [listTag(tagType)]
  }),

  updateOne: builder.mutation<TEntity, { id: string; data: TUpdateDTO }>({
    query: ({ id, data }) => ({ url: `${resourcePath}/${id}`, method: 'PUT', body: data }),
    invalidatesTags: (_result, _error, { id }) => [{ type: tagType, id }, listTag(tagType)]
  }),

  updateMany: builder.mutation<readonly TEntity[], readonly BatchUpdateItem<TUpdateDTO>[]>({
    query: (body) => ({ url: `${resourcePath}/batch`, method: 'PUT', body }),
    invalidatesTags: (result) =>
      result ? [...result.map(({ _id }) => ({ type: tagType, id: _id }) as const), listTag(tagType)] : [listTag(tagType)]
  }),

  deleteOne: builder.mutation<DeleteOneResult, string>({
    query: (id) => ({ url: `${resourcePath}/${id}`, method: 'DELETE' }),
    invalidatesTags: (_result, _error, id) => [{ type: tagType, id }, listTag(tagType)]
  }),

  deleteMany: builder.mutation<number, readonly string[]>({
    query: (ids) => ({ url: `${resourcePath}/batch`, method: 'DELETE', body: { ids } }),
    invalidatesTags: (_result, _error, ids) => [...ids.map((id) => ({ type: tagType, id }) as const), listTag(tagType)]
  })
});
import { createApi } from '@reduxjs/toolkit/query/react';
import type { ErrorLogQueryParams, PaginatedResult } from '@inithium/types';
import type { ErrorLog } from '@inithium/models';
import { unwrappingBaseQuery } from './base-query.js';

export const errorLogApi = createApi({
  reducerPath: 'errorLogApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['ErrorLog'],
  endpoints: (builder) => ({
    getErrorLogs: builder.query<PaginatedResult<ErrorLog>, ErrorLogQueryParams | void>({
      query: (params) => ({
        url: 'error-logs',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 25,
          ...(params?.appId ? { appId: params.appId } : {}),
          ...(params?.dateFrom ? { dateFrom: params.dateFrom } : {}),
          ...(params?.dateTo ? { dateTo: params.dateTo } : {})
        }
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map((log) => ({ type: 'ErrorLog' as const, id: log._id })), { type: 'ErrorLog' as const, id: 'LIST' }]
          : [{ type: 'ErrorLog' as const, id: 'LIST' }]
    })
  })
});

export const { useGetErrorLogsQuery } = errorLogApi;

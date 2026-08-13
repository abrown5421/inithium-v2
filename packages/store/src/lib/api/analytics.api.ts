import { createApi } from '@reduxjs/toolkit/query/react';
import type { TimeSeriesQueryParams, TimeSeriesResult } from '@inithium/types';
import { unwrappingBaseQuery } from './base-query.js';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['TimeSeries', 'ReportableCollection'],
  endpoints: (builder) => ({
    getTimeSeries: builder.query<TimeSeriesResult, TimeSeriesQueryParams>({
      query: (params) => ({ url: 'analytics/time-series', params }),
      providesTags: (_result, _error, params) => [
        { type: 'TimeSeries' as const, id: `${params.collectionName}:${params.bucket}:${params.dateFrom}:${params.dateTo}` }
      ]
    }),
    getReportableCollections: builder.query<readonly string[], void>({
      query: () => ({ url: 'analytics/reportable-collections' }),
      providesTags: ['ReportableCollection']
    })
  })
});

export const { useGetTimeSeriesQuery, useGetReportableCollectionsQuery } = analyticsApi;

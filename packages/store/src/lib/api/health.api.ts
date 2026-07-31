import { createApi } from '@reduxjs/toolkit/query/react';
import { unwrappingBaseQuery } from './base-query.js';

export interface HealthStatus {
  readonly status: string;
  readonly uptime: number;
  readonly timestamp: string;
}

export const healthApi = createApi({
  reducerPath: 'healthApi',
  baseQuery: unwrappingBaseQuery,
  endpoints: (builder) => ({
    checkHealth: builder.query<HealthStatus, void>({
      query: () => ({ url: 'health' })
    })
  })
});

export const { useCheckHealthQuery } = healthApi;

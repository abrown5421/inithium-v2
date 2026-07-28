import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { AppError } from '@inithium/types';

interface ApiEnvelope<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: AppError;
}

let apiBaseUrl = '/api';

export const setApiBaseUrl = (url: string): void => {
  apiBaseUrl = url;
};

const rawBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = (args, api, extraOptions) =>
  fetchBaseQuery({ baseUrl: apiBaseUrl, credentials: 'include' })(args, api, extraOptions);

export const unwrappingBaseQuery: BaseQueryFn<string | FetchArgs, unknown, AppError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const body = result.error.data as ApiEnvelope<unknown> | undefined;
    if (body?.error) {
      return { error: body.error };
    }
    return {
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Request failed'
      } as AppError
    };
  }

  const envelope = result.data as ApiEnvelope<unknown>;

  if (!envelope.success) {
    return { error: envelope.error ?? ({ type: 'INTERNAL_ERROR', message: 'Request failed' } as AppError) };
  }

  return { data: envelope.data };
};
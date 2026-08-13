import * as React from 'react';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { AppError, PaginatedResult } from '@inithium/types';
import { getApiBaseUrl, openAlert, useAppDispatch } from '@inithium/store';

interface ApiEnvelope<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: AppError;
}

const toAppError = (error: unknown): AppError => ({
  type: 'INTERNAL_ERROR',
  message: error instanceof Error ? error.message : 'Request failed'
});

const requestJson = <T,>(path: string, init?: RequestInit): ResultAsync<T, AppError> =>
  ResultAsync.fromPromise(
    fetch(`${getApiBaseUrl()}${path}`, { credentials: 'include', ...init }).then(async (response) => {
      if (response.status === 204) {
        return { success: true, data: undefined } as ApiEnvelope<T>;
      }
      return (await response.json()) as ApiEnvelope<T>;
    }),
    toAppError
  ).andThen((envelope) => (envelope.success ? okAsync(envelope.data as T) : errAsync(envelope.error ?? toAppError(undefined))));

export interface FriendsPaginatedResourceParams {
  readonly page: number;
  readonly limit: number;
  readonly field?: string;
  readonly search?: string;
}

export interface FriendsPaginatedResourceState<TItem> {
  readonly data: PaginatedResult<TItem> | undefined;
  readonly isLoading: boolean;
  readonly error: AppError | undefined;
  readonly refetch: () => void;
}

const buildQueryString = (params: FriendsPaginatedResourceParams): string => {
  const query = new URLSearchParams();
  query.set('page', String(params.page));
  query.set('limit', String(params.limit));
  if (params.field) query.set('field', params.field);
  if (params.search) query.set('search', params.search);
  return query.toString();
};

export const useFriendsPaginatedResource = <TItem,>(
  path: string,
  params: FriendsPaginatedResourceParams
): FriendsPaginatedResourceState<TItem> => {
  const [data, setData] = React.useState<PaginatedResult<TItem>>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<AppError>();
  const [refetchToken, setRefetchToken] = React.useState(0);
  const queryString = buildQueryString(params);

  React.useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(undefined);

    requestJson<PaginatedResult<TItem>>(`${path}?${queryString}`).match(
      (result) => {
        if (cancelled) return;
        setData(result);
        setIsLoading(false);
      },
      (requestError) => {
        if (cancelled) return;
        setError(requestError);
        setIsLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [path, queryString, refetchToken]);

  const refetch = React.useCallback(() => setRefetchToken((token) => token + 1), []);

  return { data, isLoading, error, refetch };
};

export interface FriendsMutationState {
  readonly pendingKey: string | undefined;
  readonly execute: (key: string, path: string, method: 'POST' | 'DELETE', body?: unknown) => void;
}

export const useFriendsMutation = (onSuccess?: () => void): FriendsMutationState => {
  const [pendingKey, setPendingKey] = React.useState<string>();
  const dispatch = useAppDispatch();

  const execute = React.useCallback(
    (key: string, path: string, method: 'POST' | 'DELETE', body?: unknown) => {
      setPendingKey(key);
      requestJson(path, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      }).match(
        () => {
          setPendingKey(undefined);
          onSuccess?.();
        },
        (error) => {
          setPendingKey(undefined);
          dispatch(openAlert({ severity: 'destructive', message: error.message }));
        }
      );
    },
    [dispatch, onSuccess]
  );

  return { pendingKey, execute };
};

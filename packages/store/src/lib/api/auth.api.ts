import { createApi } from '@reduxjs/toolkit/query/react';
import type { LoginDTO, RegisterDTO } from '@inithium/validators';
import type { SanitizedUser } from '@inithium/services';
import { unwrappingBaseQuery } from './base-query.js';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['Session'],
  endpoints: (builder) => ({
    login: builder.mutation<SanitizedUser, LoginDTO>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
      invalidatesTags: ['Session']
    }),

    register: builder.mutation<SanitizedUser, RegisterDTO>({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
      invalidatesTags: ['Session']
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: 'auth/logout', method: 'POST' }),
      invalidatesTags: ['Session']
    }),

    me: builder.query<SanitizedUser, void>({
      query: () => ({ url: 'auth/me' }),
      providesTags: ['Session']
    })
  })
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useMeQuery, useLazyMeQuery } = authApi;

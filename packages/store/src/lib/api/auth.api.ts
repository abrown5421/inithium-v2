import { createApi } from '@reduxjs/toolkit/query/react';
import type { ChangePasswordDTO, LoginDTO, RegisterDTO, UpdateSelfDTO, VerifyPasswordDTO } from '@inithium/validators';
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
    }),

    updateSelf: builder.mutation<SanitizedUser, UpdateSelfDTO>({
      query: (body) => ({ url: 'auth/me', method: 'PUT', body }),
      invalidatesTags: ['Session']
    }),

    verifyPassword: builder.mutation<{ verified: true }, VerifyPasswordDTO>({
      query: (body) => ({ url: 'auth/verify-password', method: 'POST', body })
    }),

    changePassword: builder.mutation<{ changed: true }, ChangePasswordDTO>({
      query: (body) => ({ url: 'auth/change-password', method: 'POST', body })
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useMeQuery,
  useLazyMeQuery,
  useUpdateSelfMutation,
  useVerifyPasswordMutation,
  useChangePasswordMutation
} = authApi;

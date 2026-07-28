import { createApi } from '@reduxjs/toolkit/query/react';
import type { CreateUserDTO, UpdateUserDTO, LoginDTO, RegisterDTO } from '@inithium/validators';
import type { SanitizedUser } from '@inithium/services';
import { unwrappingBaseQuery } from './base-query.js';
import { createCrudEndpoints } from './crud-endpoints.js';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    ...createCrudEndpoints<SanitizedUser, CreateUserDTO, UpdateUserDTO, 'User', 'usersApi'>(builder, 'users', 'User'),

    login: builder.mutation<SanitizedUser, LoginDTO>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body })
    }),
    register: builder.mutation<SanitizedUser, RegisterDTO>({
      query: (body) => ({ url: 'auth/register', method: 'POST', body })
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: 'auth/logout', method: 'POST' })
    })
  })
});

export const {
  useReadAllQuery: useReadAllUsersQuery,
  useReadOneQuery: useReadUserQuery,
  useReadManyQuery: useReadUsersByIdsQuery,
  useCreateOneMutation: useCreateUserMutation,
  useCreateManyMutation: useCreateUsersMutation,
  useUpdateOneMutation: useUpdateUserMutation,
  useUpdateManyMutation: useUpdateUsersMutation,
  useDeleteOneMutation: useDeleteUserMutation,
  useDeleteManyMutation: useDeleteUsersMutation,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation
} = usersApi;
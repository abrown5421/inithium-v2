import { createApi } from '@reduxjs/toolkit/query/react';
import type { PaginatedResult, PaginationQuery, UnreadNotificationCount } from '@inithium/types';
import type { Notification } from '@inithium/models';
import { unwrappingBaseQuery } from './base-query.js';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getMyNotifications: builder.query<PaginatedResult<Notification>, PaginationQuery | void>({
      query: (params) => ({
        url: 'notifications/mine',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 50
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((notification) => ({ type: 'Notification' as const, id: notification._id })),
              { type: 'Notification' as const, id: 'LIST' }
            ]
          : [{ type: 'Notification' as const, id: 'LIST' }]
    }),

    getUnreadNotificationCount: builder.query<UnreadNotificationCount, void>({
      query: () => ({ url: 'notifications/unread-count' }),
      providesTags: [{ type: 'Notification', id: 'UNREAD_COUNT' }]
    }),

    markNotificationRead: builder.mutation<Notification, string>({
      query: (id) => ({ url: `notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD_COUNT' }
      ]
    })
  })
});

export const { useGetMyNotificationsQuery, useGetUnreadNotificationCountQuery, useMarkNotificationReadMutation } = notificationApi;

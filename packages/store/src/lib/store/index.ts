import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from '../api/users.api.js';
import { assetsApi } from '../api/assets.api.js';
// collection-generator:imports

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [assetsApi.reducerPath]: assetsApi.reducer,
// collection-generator:reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      usersApi.middleware,
      assetsApi.middleware,
// collection-generator:middleware
    )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
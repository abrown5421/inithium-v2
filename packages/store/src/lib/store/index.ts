import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from '../api/users.api.js';
import { assetsApi } from '../api/assets.api.js';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [assetsApi.reducerPath]: assetsApi.reducer
    // add slice reducers from '../slices' here as you create them
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(usersApi.middleware, assetsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
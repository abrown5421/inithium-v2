import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { usersApi } from '../api/users.api.js';
import { assetsApi } from '../api/assets.api.js';
import { pageApi } from '../api/page.api.js';
import { authApi } from '../api/auth.api.js';
import { healthApi } from '../api/health.api.js';
import { authReducer } from '../slices/auth.slice.js';
import { alertReducer } from '../slices/alert.slice.js';
import { settingApi } from '../api/setting.api.js';
import { profileApi } from '../api/profile.api.js';
// collection-generator:imports

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [assetsApi.reducerPath]: assetsApi.reducer,
    [pageApi.reducerPath]: pageApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [healthApi.reducerPath]: healthApi.reducer,
    auth: authReducer,
    alert: alertReducer,
    [settingApi.reducerPath]: settingApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
// collection-generator:reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      usersApi.middleware,
      assetsApi.middleware,
      pageApi.middleware,
      authApi.middleware,
      healthApi.middleware,
      settingApi.middleware,
      profileApi.middleware,
// collection-generator:middleware
    )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
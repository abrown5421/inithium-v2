import { createSlice } from '@reduxjs/toolkit';
import type { SanitizedUser } from '@inithium/services';
import type { UserRole } from '@inithium/types';
import { authApi } from '../api/auth.api.js';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
  readonly first_name?: string;
  readonly last_name?: string;
}

export interface AuthState {
  readonly status: AuthStatus;
  readonly user: AuthUser | null;
}

const initialState: AuthState = {
  status: 'idle',
  user: null
};

const fromSanitizedUser = (user: SanitizedUser): AuthUser => ({
  id: user._id,
  email: user.email,
  role: user.role,
  first_name: user.first_name,
  last_name: user.last_name
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = fromSanitizedUser(action.payload);
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = fromSanitizedUser(action.payload);
      })
      .addMatcher(authApi.endpoints.me.matchFulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = fromSanitizedUser(action.payload);
      })
      .addMatcher(authApi.endpoints.me.matchRejected, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
      });
  }
});

export const authReducer = authSlice.reducer;

export const selectAuthStatus = (state: { auth: AuthState }): AuthStatus => state.auth.status;
export const selectCurrentUser = (state: { auth: AuthState }): AuthUser | null => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }): boolean => state.auth.status === 'authenticated';

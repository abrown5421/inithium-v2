import { useParams } from 'react-router-dom';
import type { AppError } from '@inithium/types';
import { type AuthUser, selectCurrentUser, useAppSelector } from '@inithium/store';

export interface ProfileRouteParams {
  readonly id?: string;
}

/** The `:id` segment of the current `/profile/:id` route, or null when absent. */
export const selectTargetUserId = (params: ProfileRouteParams): string | null => params.id ?? null;

/** The signed-in session user's id, or null when unauthenticated. */
export const selectAuthUserId = (user: AuthUser | null): string | null => user?.id ?? null;

/** Whether the profile being viewed belongs to the signed-in user. */
export const selectIsOwner = (targetUserId: string | null, authUserId: string | null): boolean =>
  targetUserId !== null && authUserId !== null && targetUserId === authUserId;

/** Whether the profile query resolved to "no such user" rather than loading or a live result. */
export const selectIsProfileNotFound = (error: AppError | null | undefined): boolean =>
  error?.type === 'NOT_FOUND_ERROR';

export interface ProfileIdentity {
  readonly targetUserId: string | null;
  readonly authUserId: string | null;
  readonly isOwner: boolean;
}

/** Derives the target/auth identity context for the current `/profile/:id` route from the router and session state. */
export const useProfileIdentity = (): ProfileIdentity => {
  const params = useParams<{ id: string }>();
  const authUser = useAppSelector(selectCurrentUser);

  const targetUserId = selectTargetUserId(params);
  const authUserId = selectAuthUserId(authUser);

  return {
    targetUserId,
    authUserId,
    isOwner: selectIsOwner(targetUserId, authUserId)
  };
};

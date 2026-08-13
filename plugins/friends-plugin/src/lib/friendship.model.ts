export const FRIENDSHIPS_COLLECTION = 'friendships';

export type FriendshipStatus = 'pending' | 'accepted';

export interface Friendship {
  readonly _id: string;
  readonly requesterId: string;
  readonly recipientId: string;
  readonly status: FriendshipStatus;
  readonly requestedAt: Date;
  readonly acceptedAt: Date | null;
}

export interface UserSummary {
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}

export type FriendshipRelation = 'none' | 'pending-outgoing' | 'pending-incoming' | 'accepted';

export interface UserSearchResult extends UserSummary {
  readonly friendshipStatus: FriendshipRelation;
  readonly friendshipId?: string;
}

export interface PendingFriendRequest extends UserSummary {
  readonly friendshipId: string;
  readonly requestedAt: string;
}

export interface FriendSummary extends UserSummary {
  readonly friendshipId: string;
  readonly acceptedAt: string;
}

export type SearchableUserField = 'firstName' | 'lastName' | 'email';

export const SEARCHABLE_USER_FIELD_TO_DB_KEY: Readonly<Record<SearchableUserField, string>> = {
  firstName: 'first_name',
  lastName: 'last_name',
  email: 'email'
};

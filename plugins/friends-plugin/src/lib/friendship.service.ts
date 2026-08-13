import { Db, Document, Filter, ObjectId, OptionalUnlessRequiredId } from 'mongodb';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import {
  AppError,
  PaginatedResult,
  createConflictError,
  createDatabaseError,
  createForbiddenError,
  createNotFoundError,
  createValidationError
} from '@inithium/types';
import {
  FRIENDSHIPS_COLLECTION,
  Friendship,
  FriendshipRelation,
  FriendshipStatus,
  FriendSummary,
  PendingFriendRequest,
  SEARCHABLE_USER_FIELD_TO_DB_KEY,
  SearchableUserField,
  UserSearchResult,
  UserSummary
} from './friendship.model.js';

interface FriendshipDocument {
  readonly _id: ObjectId;
  readonly requesterId: string;
  readonly recipientId: string;
  readonly status: FriendshipStatus;
  readonly requestedAt: Date;
  readonly acceptedAt: Date | null;
}

interface UserDocument {
  readonly _id: ObjectId;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
}

interface FriendAggregationRow {
  readonly _id: ObjectId;
  readonly friendUserId: string;
  readonly acceptedAt: Date | null;
  readonly friendUser: UserDocument;
}

interface PendingAggregationRow {
  readonly _id: ObjectId;
  readonly requesterId: string;
  readonly requestedAt: Date;
  readonly requesterUser: UserDocument;
}

interface AggregationFacetResult<TRow> {
  readonly data: readonly TRow[];
  readonly totalCount: readonly { readonly count: number }[];
}

export interface FriendRequestNotification {
  readonly friendshipId: string;
  readonly recipientId: string;
  readonly fromUserId: string;
  readonly fromFirstName: string;
  readonly fromLastName: string;
}

export interface FriendAcceptedNotification {
  readonly friendshipId: string;
  readonly requesterId: string;
  readonly byUserId: string;
  readonly byFirstName: string;
  readonly byLastName: string;
}

export interface FriendshipServiceOptions {
  readonly onFriendRequestSent?: (notification: FriendRequestNotification) => void;
  readonly onFriendRequestAccepted?: (notification: FriendAcceptedNotification) => void;
}

export interface FriendshipService {
  readonly sendFriendRequest: (requesterId: string, recipientId: string) => ResultAsync<Friendship, AppError>;
  readonly acceptFriendRequest: (friendshipId: string, recipientId: string) => ResultAsync<Friendship, AppError>;
  readonly declineFriendRequest: (friendshipId: string, recipientId: string) => ResultAsync<void, AppError>;
  readonly removeFriend: (friendshipId: string, currentUserId: string) => ResultAsync<void, AppError>;
  readonly searchUsers: (
    currentUserId: string,
    field: SearchableUserField,
    query: string,
    page: number,
    limit: number
  ) => ResultAsync<PaginatedResult<UserSearchResult>, AppError>;
  readonly getFriendsForUser: (
    userId: string,
    page: number,
    limit: number,
    field?: SearchableUserField,
    search?: string
  ) => ResultAsync<PaginatedResult<FriendSummary>, AppError>;
  readonly getPendingRequests: (
    userId: string,
    page: number,
    limit: number,
    field?: SearchableUserField,
    search?: string
  ) => ResultAsync<PaginatedResult<PendingFriendRequest>, AppError>;
  readonly getMutualFriends: (
    viewerId: string,
    profileOwnerId: string,
    page: number,
    limit: number,
    field?: SearchableUserField,
    search?: string
  ) => ResultAsync<PaginatedResult<FriendSummary>, AppError>;
}

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFieldFilter = (field: SearchableUserField, search: string, prefix = ''): Document => ({
  [`${prefix}${SEARCHABLE_USER_FIELD_TO_DB_KEY[field]}`]: { $regex: escapeRegExp(search), $options: 'i' }
});

const toObjectId = (id: string): ObjectId => (ObjectId.isValid(id) ? new ObjectId(id) : (id as unknown as ObjectId));

const toUserSummary = (user: UserDocument): UserSummary => ({
  userId: user._id.toString(),
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email
});

const toFriendship = (doc: FriendshipDocument): Friendship => ({
  _id: doc._id.toString(),
  requesterId: doc.requesterId,
  recipientId: doc.recipientId,
  status: doc.status,
  requestedAt: doc.requestedAt,
  acceptedAt: doc.acceptedAt
});

export const createFriendshipService = (db: Db, options: FriendshipServiceOptions = {}): FriendshipService => {
  const friendships = db.collection<FriendshipDocument>(FRIENDSHIPS_COLLECTION);
  const users = db.collection<UserDocument>('users');

  const lookupUserSummary = (userId: string): ResultAsync<UserSummary, AppError> =>
    ResultAsync.fromPromise(users.findOne({ _id: toObjectId(userId) }), (error) =>
      createDatabaseError('Failed to look up user', error)
    ).andThen((user) => (user ? okAsync(toUserSummary(user)) : errAsync(createNotFoundError('User not found'))));

  const findFriendshipBetween = (userAId: string, userBId: string): ResultAsync<Friendship | null, AppError> =>
    ResultAsync.fromPromise(
      friendships.findOne({
        $or: [
          { requesterId: userAId, recipientId: userBId },
          { requesterId: userBId, recipientId: userAId }
        ]
      }),
      (error) => createDatabaseError('Failed to look up friendship record', error)
    ).map((doc) => (doc ? toFriendship(doc) : null));

  const insertFriendship = (requesterId: string, recipientId: string): ResultAsync<Friendship, AppError> => {
    const requestedAt = new Date();
    const payload = { requesterId, recipientId, status: 'pending', requestedAt, acceptedAt: null } as unknown as OptionalUnlessRequiredId<FriendshipDocument>;
    return ResultAsync.fromPromise(
      friendships.insertOne(payload),
      (error) => createDatabaseError('Failed to create friend request', error)
    ).map((result) => ({
      _id: result.insertedId.toString(),
      requesterId,
      recipientId,
      status: 'pending' as const,
      requestedAt,
      acceptedAt: null
    }));
  };

  const updateFriendshipStatus = (friendshipId: string, status: FriendshipStatus): ResultAsync<Friendship, AppError> =>
    ResultAsync.fromPromise(
      friendships.findOneAndUpdate(
        { _id: toObjectId(friendshipId) },
        { $set: { status, acceptedAt: status === 'accepted' ? new Date() : null } },
        { returnDocument: 'after' }
      ),
      (error) => createDatabaseError('Failed to update friend request', error)
    ).andThen((doc) => (doc ? okAsync(toFriendship(doc)) : errAsync(createNotFoundError('Friend request not found'))));

  const getFriendUserIds = (userId: string): ResultAsync<readonly string[], AppError> =>
    ResultAsync.fromPromise(
      friendships.find({ status: 'accepted', $or: [{ requesterId: userId }, { recipientId: userId }] }).toArray(),
      (error) => createDatabaseError('Failed to load friend ids', error)
    ).map((docs) => docs.map((doc) => (doc.requesterId === userId ? doc.recipientId : doc.requesterId)));

  const runFriendsAggregation = (
    userId: string,
    page: number,
    limit: number,
    field: SearchableUserField | undefined,
    search: string | undefined,
    restrictToUserIds: readonly string[] | undefined
  ): ResultAsync<PaginatedResult<FriendSummary>, AppError> => {
    const pipeline: Document[] = [
      { $match: { status: 'accepted', $or: [{ requesterId: userId }, { recipientId: userId }] } },
      { $addFields: { friendUserId: { $cond: [{ $eq: ['$requesterId', userId] }, '$recipientId', '$requesterId'] } } }
    ];

    if (restrictToUserIds) {
      pipeline.push({ $match: { friendUserId: { $in: [...restrictToUserIds] } } });
    }

    pipeline.push(
      { $addFields: { friendObjectId: { $toObjectId: '$friendUserId' } } },
      { $lookup: { from: 'users', localField: 'friendObjectId', foreignField: '_id', as: 'friendUser' } },
      { $unwind: '$friendUser' }
    );

    if (search) {
      pipeline.push({ $match: buildFieldFilter(field ?? 'firstName', search, 'friendUser.') });
    }

    pipeline.push({
      $facet: {
        data: [{ $sort: { acceptedAt: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit }],
        totalCount: [{ $count: 'count' }]
      }
    });

    return ResultAsync.fromPromise(
      friendships.aggregate<AggregationFacetResult<FriendAggregationRow>>(pipeline).toArray(),
      (error) => createDatabaseError('Failed to load friends', error)
    ).map(([result]) => {
      const rows = result?.data ?? [];
      const total = result?.totalCount[0]?.count ?? 0;
      return {
        data: rows.map((row) => ({
          friendshipId: row._id.toString(),
          userId: row.friendUserId,
          firstName: row.friendUser.first_name,
          lastName: row.friendUser.last_name,
          email: row.friendUser.email,
          acceptedAt: (row.acceptedAt ?? new Date()).toISOString()
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    });
  };

  const sendFriendRequest = (requesterId: string, recipientId: string): ResultAsync<Friendship, AppError> => {
    if (requesterId === recipientId) {
      return errAsync(createValidationError('You cannot send a friend request to yourself'));
    }

    return lookupUserSummary(requesterId).andThen((requester) =>
      findFriendshipBetween(requesterId, recipientId).andThen((existing) => {
        if (existing?.status === 'accepted') {
          return errAsync(createConflictError('You are already friends'));
        }

        if (existing?.status === 'pending' && existing.requesterId === requesterId) {
          return errAsync(createConflictError('Friend request already sent'));
        }

        if (existing) {
          return updateFriendshipStatus(existing._id, 'accepted').map((accepted) => {
            options.onFriendRequestAccepted?.({
              friendshipId: accepted._id,
              requesterId: existing.requesterId,
              byUserId: requesterId,
              byFirstName: requester.firstName,
              byLastName: requester.lastName
            });
            return accepted;
          });
        }

        return insertFriendship(requesterId, recipientId).map((friendship) => {
          options.onFriendRequestSent?.({
            friendshipId: friendship._id,
            recipientId,
            fromUserId: requesterId,
            fromFirstName: requester.firstName,
            fromLastName: requester.lastName
          });
          return friendship;
        });
      })
    );
  };

  const acceptFriendRequest = (friendshipId: string, recipientId: string): ResultAsync<Friendship, AppError> =>
    ResultAsync.fromPromise(friendships.findOne({ _id: toObjectId(friendshipId) }), (error) =>
      createDatabaseError('Failed to look up friend request', error)
    ).andThen((doc) => {
      if (!doc) return errAsync(createNotFoundError('Friend request not found'));
      if (doc.recipientId !== recipientId) return errAsync(createForbiddenError('You cannot accept this request'));
      if (doc.status !== 'pending') return errAsync(createConflictError('This request is no longer pending'));

      return updateFriendshipStatus(friendshipId, 'accepted').andThen((accepted) =>
        lookupUserSummary(recipientId).map((accepter) => {
          options.onFriendRequestAccepted?.({
            friendshipId: accepted._id,
            requesterId: accepted.requesterId,
            byUserId: recipientId,
            byFirstName: accepter.firstName,
            byLastName: accepter.lastName
          });
          return accepted;
        })
      );
    });

  const declineFriendRequest = (friendshipId: string, recipientId: string): ResultAsync<void, AppError> =>
    ResultAsync.fromPromise(friendships.findOne({ _id: toObjectId(friendshipId) }), (error) =>
      createDatabaseError('Failed to look up friend request', error)
    ).andThen((doc) => {
      if (!doc) return errAsync(createNotFoundError('Friend request not found'));
      if (doc.recipientId !== recipientId) return errAsync(createForbiddenError('You cannot decline this request'));

      return ResultAsync.fromPromise(friendships.deleteOne({ _id: doc._id }), (error) =>
        createDatabaseError('Failed to decline friend request', error)
      ).map(() => undefined);
    });

  const removeFriend = (friendshipId: string, currentUserId: string): ResultAsync<void, AppError> =>
    ResultAsync.fromPromise(friendships.findOne({ _id: toObjectId(friendshipId) }), (error) =>
      createDatabaseError('Failed to look up friendship', error)
    ).andThen((doc) => {
      if (!doc) return errAsync(createNotFoundError('Friendship not found'));
      if (doc.requesterId !== currentUserId && doc.recipientId !== currentUserId) {
        return errAsync(createForbiddenError('You cannot remove this friendship'));
      }
      if (doc.status !== 'accepted') return errAsync(createConflictError('This is not an active friendship'));

      return ResultAsync.fromPromise(friendships.deleteOne({ _id: doc._id }), (error) =>
        createDatabaseError('Failed to remove friend', error)
      ).map(() => undefined);
    });

  const searchUsers = (
    currentUserId: string,
    field: SearchableUserField,
    query: string,
    page: number,
    limit: number
  ): ResultAsync<PaginatedResult<UserSearchResult>, AppError> => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return okAsync({ data: [], total: 0, page, limit, totalPages: 0 });
    }

    const filter = {
      _id: { $ne: toObjectId(currentUserId) },
      ...buildFieldFilter(field, trimmedQuery)
    } as Filter<UserDocument>;

    return ResultAsync.fromPromise(
      Promise.all([
        users
          .find(filter)
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray(),
        users.countDocuments(filter)
      ]),
      (error) => createDatabaseError('Failed to search users', error)
    ).andThen(([matchedUsers, total]) => {
      const matchedIds = matchedUsers.map((user) => user._id.toString());
      return ResultAsync.fromPromise(
        friendships
          .find({
            $or: [
              { requesterId: currentUserId, recipientId: { $in: matchedIds } },
              { recipientId: currentUserId, requesterId: { $in: matchedIds } }
            ]
          })
          .toArray(),
        (error) => createDatabaseError('Failed to resolve friendship statuses', error)
      ).map((relatedFriendships) => {
        const relationByUserId = new Map<string, { readonly status: FriendshipRelation; readonly friendshipId: string }>();
        relatedFriendships.forEach((friendship) => {
          const otherUserId = friendship.requesterId === currentUserId ? friendship.recipientId : friendship.requesterId;
          const friendshipId = friendship._id.toString();
          if (friendship.status === 'accepted') {
            relationByUserId.set(otherUserId, { status: 'accepted', friendshipId });
          } else if (friendship.requesterId === currentUserId) {
            relationByUserId.set(otherUserId, { status: 'pending-outgoing', friendshipId });
          } else {
            relationByUserId.set(otherUserId, { status: 'pending-incoming', friendshipId });
          }
        });

        const data: readonly UserSearchResult[] = matchedUsers.map((user) => {
          const relation = relationByUserId.get(user._id.toString());
          return {
            ...toUserSummary(user),
            friendshipStatus: relation?.status ?? 'none',
            friendshipId: relation?.friendshipId
          };
        });

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
      });
    });
  };

  const getFriendsForUser = (
    userId: string,
    page: number,
    limit: number,
    field?: SearchableUserField,
    search?: string
  ): ResultAsync<PaginatedResult<FriendSummary>, AppError> =>
    runFriendsAggregation(userId, page, limit, field, search, undefined);

  const getPendingRequests = (
    userId: string,
    page: number,
    limit: number,
    field?: SearchableUserField,
    search?: string
  ): ResultAsync<PaginatedResult<PendingFriendRequest>, AppError> => {
    const pipeline: Document[] = [
      { $match: { status: 'pending', recipientId: userId } },
      { $addFields: { requesterObjectId: { $toObjectId: '$requesterId' } } },
      { $lookup: { from: 'users', localField: 'requesterObjectId', foreignField: '_id', as: 'requesterUser' } },
      { $unwind: '$requesterUser' }
    ];

    if (search) {
      pipeline.push({ $match: buildFieldFilter(field ?? 'firstName', search, 'requesterUser.') });
    }

    pipeline.push({
      $facet: {
        data: [{ $sort: { requestedAt: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit }],
        totalCount: [{ $count: 'count' }]
      }
    });

    return ResultAsync.fromPromise(
      friendships.aggregate<AggregationFacetResult<PendingAggregationRow>>(pipeline).toArray(),
      (error) => createDatabaseError('Failed to load pending requests', error)
    ).map(([result]) => {
      const rows = result?.data ?? [];
      const total = result?.totalCount[0]?.count ?? 0;
      return {
        data: rows.map((row) => ({
          friendshipId: row._id.toString(),
          userId: row.requesterId,
          firstName: row.requesterUser.first_name,
          lastName: row.requesterUser.last_name,
          email: row.requesterUser.email,
          requestedAt: row.requestedAt.toISOString()
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    });
  };

  const getMutualFriends = (
    viewerId: string,
    profileOwnerId: string,
    page: number,
    limit: number,
    field?: SearchableUserField,
    search?: string
  ): ResultAsync<PaginatedResult<FriendSummary>, AppError> =>
    getFriendUserIds(viewerId).andThen((viewerFriendIds) =>
      runFriendsAggregation(profileOwnerId, page, limit, field, search, viewerFriendIds)
    );

  return {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    searchUsers,
    getFriendsForUser,
    getPendingRequests,
    getMutualFriends
  };
};

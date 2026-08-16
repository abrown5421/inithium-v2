import { Db, Filter, ObjectId, OptionalUnlessRequiredId } from 'mongodb';
import { ResultAsync } from 'neverthrow';
import {
  AppError,
  PaginatedResult,
  UnreadNotificationCount,
  createDatabaseError,
  createForbiddenError,
  createNotFoundError
} from '@inithium/types';
import { Notification } from '@inithium/models';
import { CreateNotificationDTO, NotificationQueryDTO } from '@inithium/validators';

export interface NotificationService {
  readonly create: (input: CreateNotificationDTO) => ResultAsync<Notification, AppError>;
  readonly listMine: (userId: string, query: NotificationQueryDTO) => ResultAsync<PaginatedResult<Notification>, AppError>;
  readonly countUnread: (userId: string) => ResultAsync<UnreadNotificationCount, AppError>;
  readonly markRead: (id: string, userId: string) => ResultAsync<Notification, AppError>;
}

const toObjectId = (id: string): ObjectId => (ObjectId.isValid(id) ? new ObjectId(id) : (id as unknown as ObjectId));

export const createNotificationService = (db: Db): NotificationService => {
  const collection = db.collection<Notification>('notifications');

  return {
    create: (input) => {
      const now = new Date();
      const payload = { ...input, read: false, createdAt: now, updatedAt: now } as unknown as OptionalUnlessRequiredId<Notification>;

      return ResultAsync.fromPromise(
        collection.insertOne(payload),
        (error) => createDatabaseError('Failed to create notification', error)
      ).map((res) => ({ ...input, read: false, createdAt: now, updatedAt: now, _id: res.insertedId.toString() }) as unknown as Notification);
    },

    listMine: (userId, query) => {
      const filter = { userId } as Filter<Notification>;

      return ResultAsync.fromPromise(
        Promise.all([
          collection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((query.page - 1) * query.limit)
            .limit(query.limit)
            .toArray(),
          collection.countDocuments(filter)
        ]),
        (error) => createDatabaseError('Failed to list notifications', error)
      ).map(([docs, total]) => ({
        data: docs as unknown as readonly Notification[],
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit)
      }));
    },

    countUnread: (userId) =>
      ResultAsync.fromPromise(
        collection.countDocuments({ userId, read: false } as Filter<Notification>),
        (error) => createDatabaseError('Failed to count unread notifications', error)
      ).map((count) => ({ count })),

    markRead: (id, userId) => {
      const filter = { _id: toObjectId(id) } as unknown as Filter<Notification>;

      return ResultAsync.fromPromise(
        collection.findOne(filter),
        (error) => createDatabaseError(`Failed to find notification ${id}`, error)
      ).andThen((existing) => {
        if (!existing) {
          return ResultAsync.fromPromise(Promise.reject(createNotFoundError(`Notification ${id} not found`)), (e) => e as AppError);
        }
        if (existing.userId !== userId) {
          return ResultAsync.fromPromise(
            Promise.reject(createForbiddenError('You can only mark your own notifications as read')),
            (e) => e as AppError
          );
        }

        return ResultAsync.fromPromise(
          collection.findOneAndUpdate(
            filter,
            { $set: { read: true, readAt: new Date(), updatedAt: new Date() } },
            { returnDocument: 'after' }
          ),
          (error) => createDatabaseError(`Failed to mark notification ${id} as read`, error)
        );
      }).map((doc) => doc as unknown as Notification);
    }
  };
};

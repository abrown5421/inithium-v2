import { Db, Filter, UpdateFilter, OptionalUnlessRequiredId } from 'mongodb';
import { ResultAsync } from 'neverthrow';
import { AppError, BaseEntity, PaginatedResult, createDatabaseError, createNotFoundError } from '@inithium/types';

export interface CrudRepository<T extends BaseEntity> {
  readonly createOne: (doc: Omit<T, '_id' | 'createdAt' | 'updatedAt'>) => ResultAsync<T, AppError>;
  readonly createMany: (docs: readonly Omit<T, '_id' | 'createdAt' | 'updatedAt'>[]) => ResultAsync<readonly T[], AppError>;
  readonly readOne: (id: string) => ResultAsync<T, AppError>;
  readonly readMany: (ids: readonly string[]) => ResultAsync<readonly T[], AppError>;
  readonly readAll: (page: number, limit: number, filter?: Filter<T>) => ResultAsync<PaginatedResult<T>, AppError>;
  readonly updateOne: (id: string, update: Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>) => ResultAsync<T, AppError>;
  readonly updateMany: (items: readonly { readonly id: string; readonly data: Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>> }[]) => ResultAsync<readonly T[], AppError>;
  readonly deleteOne: (id: string) => ResultAsync<void, AppError>;
  readonly deleteMany: (ids: readonly string[]) => ResultAsync<number, AppError>;
}

export const createRepository = <T extends BaseEntity>(db: Db, collectionName: string): CrudRepository<T> => {
  const collection = db.collection<T>(collectionName);

  return {
    createOne: (doc) => {
      const now = new Date();
      const payload = { ...doc, createdAt: now, updatedAt: now } as unknown as OptionalUnlessRequiredId<T>;
      return ResultAsync.fromPromise(
        collection.insertOne(payload),
        (err) => createDatabaseError(`Failed to insert into ${collectionName}`, err)
      ).map((res) => ({ ...doc, createdAt: now, updatedAt: now, _id: res.insertedId.toString() } as unknown as T));
    },

    createMany: (docs) => {
      const now = new Date();
      const payloads = docs.map((d) => ({ ...d, createdAt: now, updatedAt: now })) as unknown as OptionalUnlessRequiredId<T>[];
      return ResultAsync.fromPromise(
        collection.insertMany(payloads),
        (err) => createDatabaseError(`Failed to batch insert into ${collectionName}`, err)
      ).map((res) =>
        docs.map((d, idx) => ({ ...d, createdAt: now, updatedAt: now, _id: res.insertedIds[idx].toString() } as unknown as T))
      );
    },

    readOne: (id) => {
      const filter = { _id: id } as Filter<T>;
      return ResultAsync.fromPromise(
        collection.findOne(filter),
        (err) => createDatabaseError(`Error finding document ${id} in ${collectionName}`, err)
      ).andThen((doc) => {
        if (!doc) return ResultAsync.fromPromise(Promise.reject(createNotFoundError(`Document with ID ${id} not found`)), (e) => e as AppError);
        return ResultAsync.fromSafePromise(Promise.resolve(doc as unknown as T));
      });
    },

    readMany: (ids) => {
      const filter = { _id: { $in: ids } } as Filter<T>;
      return ResultAsync.fromPromise(
        collection.find(filter).toArray(),
        (err) => createDatabaseError(`Error reading documents from ${collectionName}`, err)
      ).map((docs) => docs as unknown as readonly T[]);
    },

    readAll: (page = 1, limit = 25, filter = {} as Filter<T>) => {
      const actualLimit = limit > 0 ? limit : 25;
      const skip = (Math.max(1, page) - 1) * actualLimit;

      return ResultAsync.fromPromise(
        Promise.all([
          collection.find(filter).skip(skip).limit(actualLimit).toArray(),
          collection.countDocuments(filter)
        ]),
        (err) => createDatabaseError(`Error fetching paginated set from ${collectionName}`, err)
      ).map(([docs, total]) => ({
        data: docs as unknown as readonly T[],
        total,
        page,
        limit: actualLimit,
        totalPages: Math.ceil(total / actualLimit)
      }));
    },

    updateOne: (id, update) => {
      const filter = { _id: id } as Filter<T>;
      const payload = { $set: { ...update, updatedAt: new Date() } } as UpdateFilter<T>;
      return ResultAsync.fromPromise(
        collection.findOneAndUpdate(filter, payload, { returnDocument: 'after' }),
        (err) => createDatabaseError(`Error updating document ${id} in ${collectionName}`, err)
      ).andThen((res) => {
        if (!res) return ResultAsync.fromPromise(Promise.reject(createNotFoundError(`Document with ID ${id} not found`)), (e) => e as AppError);
        return ResultAsync.fromSafePromise(Promise.resolve(res as unknown as T));
      });
    },

    updateMany: (items) => {
      const operations = items.map((item) => ({
        updateOne: {
          filter: { _id: item.id } as Filter<T>,
          update: { $set: { ...item.data, updatedAt: new Date() } } as UpdateFilter<T>
        }
      }));
      return ResultAsync.fromPromise(
        collection.bulkWrite(operations),
        (err) => createDatabaseError(`Error batch updating in ${collectionName}`, err)
      ).andThen(() => {
        const ids = items.map((i) => i.id);
        const filter = { _id: { $in: ids } } as Filter<T>;
        return ResultAsync.fromPromise(
          collection.find(filter).toArray(),
          (err) => createDatabaseError(`Error fetching updated records from ${collectionName}`, err)
        ).map((docs) => docs as unknown as readonly T[]);
      });
    },

    deleteOne: (id) => {
      const filter = { _id: id } as Filter<T>;
      return ResultAsync.fromPromise(
        collection.deleteOne(filter),
        (err) => createDatabaseError(`Error deleting document ${id} from ${collectionName}`, err)
      ).andThen((res) => {
        if (res.deletedCount === 0) {
          return ResultAsync.fromPromise(Promise.reject(createNotFoundError(`Document with ID ${id} not found`)), (e) => e as AppError);
        }
        return ResultAsync.fromSafePromise(Promise.resolve());
      });
    },

    deleteMany: (ids) => {
      const filter = { _id: { $in: ids } } as Filter<T>;
      return ResultAsync.fromPromise(
        collection.deleteMany(filter),
        (err) => createDatabaseError(`Error batch deleting from ${collectionName}`, err)
      ).map((res) => res.deletedCount);
    }
  };
};
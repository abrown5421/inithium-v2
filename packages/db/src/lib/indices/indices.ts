import { Db, IndexSpecification, CreateIndexesOptions } from 'mongodb';
import { ResultAsync } from 'neverthrow';
import { AppError, createDatabaseError } from '@inithium/types';

export const ensureIndex = (
  db: Db,
  collectionName: string,
  indexSpec: IndexSpecification,
  options?: CreateIndexesOptions
): ResultAsync<string, AppError> => {
  return ResultAsync.fromPromise(
    db.collection(collectionName).createIndex(indexSpec, options),
    (error) => createDatabaseError(`Failed to enforce index on ${collectionName}`, error)
  );
};
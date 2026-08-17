import { Db, Document, MongoBulkWriteError } from 'mongodb';
import { ResultAsync, okAsync, errAsync } from 'neverthrow';
import { AppError, createDatabaseError } from '@inithium/types';

/**
 * Inserts fixture documents directly into `collectionName`, bypassing every repository/service in
 * this codebase on purpose: those always hash passwords, always auto-generate `_id`, and (for
 * collection-definitions) scaffold a brand-new generated collection as a side effect. A one-time
 * import of already-valid, already-hashed, already-`_id`'d exported data needs none of that.
 *
 * `ordered: false` so Mongo attempts every document instead of stopping at the first failure. If
 * every failure reported back is a duplicate key (code 11000), the whole call is treated as a
 * no-op — those documents are already there, most likely from a retried seed after `_seed_state`
 * was deleted by hand to force a clean rerun. Any other failure is fatal.
 */
export const rawInsertMany = (
  db: Db,
  collectionName: string,
  docs: readonly Document[]
): ResultAsync<number, AppError> => {
  if (docs.length === 0) {
    return okAsync(0);
  }

  return ResultAsync.fromPromise(
    db.collection(collectionName).insertMany(docs as Document[], { ordered: false }),
    (error) => error
  )
    .map((result) => result.insertedCount)
    .orElse((error) => {
      if (error instanceof MongoBulkWriteError) {
        const writeErrors = Array.isArray(error.writeErrors) ? error.writeErrors : [error.writeErrors];
        if (writeErrors.every((writeError) => writeError.code === 11000)) {
          return okAsync(error.result.insertedCount);
        }
      }
      return errAsync(createDatabaseError(`Failed to seed ${collectionName}`, error));
    });
};

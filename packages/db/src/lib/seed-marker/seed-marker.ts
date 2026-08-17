import { Db } from 'mongodb';
import { ResultAsync, okAsync, errAsync } from 'neverthrow';
import { AppError, createDatabaseError } from '@inithium/types';

const SEED_STATE_COLLECTION = '_seed_state';
const INITIAL_SEED_ID = 'initial-seed';

interface SeedStateDoc {
  readonly _id: string;
  readonly status: 'in-progress' | 'complete';
  readonly startedAt: Date;
  readonly completedAt?: Date;
}

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 11000;

/**
 * Atomically claims the one-time initial seed. `_id` doubles as the lock: Mongo enforces `_id`
 * uniqueness for free, so if two API instances boot at once only one `insertOne` succeeds — the
 * other observes `'already-seeded'` instead of both racing to insert duplicate fixture data. A
 * doc left `'in-progress'` (a prior seed crashed partway through) also reads as already-claimed;
 * it is never auto-retried, since blindly re-running could duplicate whatever that crashed run
 * already inserted. Delete the `_seed_state` document by hand to force a clean retry once the
 * underlying problem is fixed.
 */
export const claimInitialSeed = (db: Db): ResultAsync<'claimed' | 'already-seeded', AppError> => {
  const doc: SeedStateDoc = { _id: INITIAL_SEED_ID, status: 'in-progress', startedAt: new Date() };
  return ResultAsync.fromPromise(
    db.collection<SeedStateDoc>(SEED_STATE_COLLECTION).insertOne(doc),
    (error) => error
  ).map(
    () => 'claimed' as const
  ).orElse((error) =>
    isDuplicateKeyError(error)
      ? okAsync('already-seeded' as const)
      : errAsync(createDatabaseError('Failed to claim initial seed marker', error))
  );
};

export const completeInitialSeed = (db: Db): ResultAsync<void, AppError> =>
  ResultAsync.fromPromise(
    db
      .collection<SeedStateDoc>(SEED_STATE_COLLECTION)
      .updateOne({ _id: INITIAL_SEED_ID }, { $set: { status: 'complete', completedAt: new Date() } }),
    (error) => createDatabaseError('Failed to mark initial seed complete', error)
  ).map(() => undefined);

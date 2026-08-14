import { createHash } from 'crypto';
import { Db, Filter, UpdateFilter } from 'mongodb';
import { ResultAsync } from 'neverthrow';
import { AppError, PaginatedResult, createDatabaseError } from '@inithium/types';
import { ErrorLog } from '@inithium/models';
import { ErrorLogQueryDTO, ReportErrorLogDTO } from '@inithium/validators';

export interface ErrorLogService {
  readonly reportError: (input: ReportErrorLogDTO) => ResultAsync<{ readonly fingerprint: string }, AppError>;
  readonly listErrorLogs: (query: ErrorLogQueryDTO) => ResultAsync<PaginatedResult<ErrorLog>, AppError>;
}

const MAX_FINGERPRINT_STACK_LINES = 2;

const normalizeMessage = (message: string): string => message.trim().toLowerCase().replace(/\s+/g, ' ');

/** Stack frames are far more stable across occurrences than free-text messages, which often embed dynamic ids/timestamps. */
const computeFingerprint = (input: ReportErrorLogDTO): string => {
  const stackLines = (input.stack ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, MAX_FINGERPRINT_STACK_LINES);

  const basis = stackLines.length > 0 ? stackLines.join('\n') : `${input.appId}:${normalizeMessage(input.message)}`;

  return createHash('sha1').update(basis).digest('hex');
};

const buildListFilter = (query: ErrorLogQueryDTO): Filter<ErrorLog> => ({
  ...(query.appId ? { appId: query.appId } : {}),
  ...(query.dateFrom || query.dateTo
    ? {
        updatedAt: {
          ...(query.dateFrom ? { $gte: query.dateFrom } : {}),
          ...(query.dateTo ? { $lte: query.dateTo } : {})
        }
      }
    : {})
});

export const createErrorLogService = (db: Db): ErrorLogService => {
  const collection = db.collection<ErrorLog>('error-logs');

  return {
    reportError: (input) => {
      const fingerprint = computeFingerprint(input);
      const now = new Date();

      const insertFields = {
        fingerprint,
        message: input.message,
        appId: input.appId,
        route: input.route,
        createdAt: now,
        ...(input.stack ? { stack: input.stack } : {}),
        ...(input.userAgent ? { userAgent: input.userAgent } : {}),
        ...(input.userId ? { userId: input.userId } : {}),
        ...(input.sessionId ? { sessionId: input.sessionId } : {})
      };

      return ResultAsync.fromPromise(
        collection.findOneAndUpdate(
          { fingerprint } as Filter<ErrorLog>,
          {
            $setOnInsert: insertFields,
            $set: { updatedAt: now },
            $inc: { occurrenceCount: 1 }
          } as unknown as UpdateFilter<ErrorLog>,
          { upsert: true }
        ),
        (error) => createDatabaseError('Failed to record error log', error)
      ).map(() => ({ fingerprint }));
    },

    listErrorLogs: (query) => {
      const filter = buildListFilter(query);

      return ResultAsync.fromPromise(
        Promise.all([
          collection.find(filter).sort({ updatedAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit).toArray(),
          collection.countDocuments(filter)
        ]),
        (error) => createDatabaseError('Failed to list error logs', error)
      ).map(([docs, total]) => ({
        data: docs as unknown as readonly ErrorLog[],
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit)
      }));
    }
  };
};

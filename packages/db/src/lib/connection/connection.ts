import { MongoClient, Db } from 'mongodb';
import { ResultAsync } from 'neverthrow';
import { AppError, createDatabaseError } from '@inithium/types';

let clientInstance: MongoClient | null = null;

export const connectToDatabase = (uri: string, dbName?: string): ResultAsync<Db, AppError> => {
  return ResultAsync.fromPromise(
    (async () => {
      if (!clientInstance) {
        clientInstance = new MongoClient(uri);
        await clientInstance.connect();
      }
      return clientInstance.db(dbName);
    })(),
    (error) => createDatabaseError('Failed to connect to MongoDB', error)
  );
};

export const closeDatabaseConnection = (): ResultAsync<void, AppError> => {
  return ResultAsync.fromPromise(
    (async () => {
      if (clientInstance) {
        await clientInstance.close();
        clientInstance = null;
      }
    })(),
    (error) => createDatabaseError('Failed to close database connection', error)
  );
};
import { Db } from 'mongodb';
import { ResultAsync } from 'neverthrow';
import { AppError, TimeSeriesBucket, TimeSeriesPoint, TimeSeriesResult, createDatabaseError } from '@inithium/types';

export interface TimeSeriesQuery {
  readonly collectionName: string;
  readonly bucket: TimeSeriesBucket;
  readonly dateFrom: Date;
  readonly dateTo: Date;
}

export interface TimeSeriesAggregationService {
  readonly getTimeSeries: (query: TimeSeriesQuery) => ResultAsync<TimeSeriesResult, AppError>;
}

interface TimeSeriesAggregationRow {
  readonly bucketStart: string;
  readonly count: number;
}

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

export const createTimeSeriesAggregationService = (db: Db): TimeSeriesAggregationService => ({
  getTimeSeries: (query) => {
    const pipeline = [
      { $match: { createdAt: { $gte: query.dateFrom, $lte: query.dateTo } } },
      {
        $group: {
          _id: { $dateTrunc: { date: '$createdAt', unit: query.bucket, timezone: 'UTC' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          bucketStart: { $dateToString: { date: '$_id', format: '%Y-%m-%d', timezone: 'UTC' } },
          count: 1
        }
      }
    ];

    return ResultAsync.fromPromise(
      db.collection(query.collectionName).aggregate<TimeSeriesAggregationRow>(pipeline).toArray(),
      (error) => createDatabaseError(`Failed to aggregate time series for ${query.collectionName}`, error)
    ).map(
      (rows): TimeSeriesResult => ({
        collectionName: query.collectionName,
        bucket: query.bucket,
        dateFrom: toIsoDate(query.dateFrom),
        dateTo: toIsoDate(query.dateTo),
        points: rows.map((row): TimeSeriesPoint => ({ bucketStart: row.bucketStart, count: row.count }))
      })
    );
  }
});

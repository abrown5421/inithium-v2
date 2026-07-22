export interface BaseEntity {
  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface PaginationQuery {
  readonly page?: number;
  readonly limit?: number;
}

export interface PaginatedResult<T> {
  readonly data: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}
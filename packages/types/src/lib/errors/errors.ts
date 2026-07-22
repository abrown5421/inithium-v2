export type AppError =
  | { readonly type: 'VALIDATION_ERROR'; readonly message: string; readonly details?: unknown }
  | { readonly type: 'NOT_FOUND_ERROR'; readonly message: string }
  | { readonly type: 'CONFLICT_ERROR'; readonly message: string }
  | { readonly type: 'UNAUTHORIZED_ERROR'; readonly message: string }
  | { readonly type: 'FORBIDDEN_ERROR'; readonly message: string }
  | { readonly type: 'DATABASE_ERROR'; readonly message: string; readonly cause?: unknown }
  | { readonly type: 'INTERNAL_ERROR'; readonly message: string };

export const createValidationError = (message: string, details?: unknown): AppError => ({
  type: 'VALIDATION_ERROR',
  message,
  details
});

export const createNotFoundError = (message: string): AppError => ({
  type: 'NOT_FOUND_ERROR',
  message
});

export const createConflictError = (message: string): AppError => ({
  type: 'CONFLICT_ERROR',
  message
});

export const createUnauthorizedError = (message: string): AppError => ({
  type: 'UNAUTHORIZED_ERROR',
  message
});

export const createForbiddenError = (message: string): AppError => ({
  type: 'FORBIDDEN_ERROR',
  message
});

export const createDatabaseError = (message: string, cause?: unknown): AppError => ({
  type: 'DATABASE_ERROR',
  message,
  cause
});

export const createInternalError = (message: string): AppError => ({
  type: 'INTERNAL_ERROR',
  message
});

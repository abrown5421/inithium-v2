import type { Result } from 'neverthrow';
import type { AppError } from '@inithium/types';

export interface AuthenticatedIdentity {
  readonly userId: string;
}

export interface HandshakeContext {
  readonly auth: Record<string, unknown>;
  readonly headers: Record<string, string | readonly string[] | undefined>;
  readonly query: Record<string, string | readonly string[] | undefined>;
}

export type AuthMiddleware<TIdentity extends AuthenticatedIdentity = AuthenticatedIdentity> = (
  context: HandshakeContext
) => Promise<Result<TIdentity, AppError>> | Result<TIdentity, AppError>;

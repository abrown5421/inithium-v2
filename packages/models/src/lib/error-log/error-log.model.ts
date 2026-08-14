import { BaseEntity } from '@inithium/types';

export interface ErrorLog extends BaseEntity {
  readonly fingerprint: string;
  readonly message: string;
  readonly stack?: string;
  readonly appId: string;
  readonly route: string;
  readonly userAgent?: string;
  readonly userId?: string;
  readonly sessionId?: string;
  readonly occurrenceCount: number;
}

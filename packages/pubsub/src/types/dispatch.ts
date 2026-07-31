import type { Channel } from './channels.js';

export type DispatchTargets = readonly Channel[] | 'ALL';

export interface DispatchMessage<TPayload = unknown> {
  readonly targets: DispatchTargets;
  readonly event: string;
  readonly payload: TPayload;
}

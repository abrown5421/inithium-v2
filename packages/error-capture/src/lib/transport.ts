export interface ErrorReportPayload {
  readonly message: string;
  readonly stack?: string;
  readonly appId: string;
  readonly route: string;
  readonly userAgent?: string;
  readonly userId?: string;
  readonly sessionId?: string;
}

/**
 * Uses raw fetch, not RTK Query — must work before Redux mounts and during page unload.
 * Takes `apiOrigin` explicitly rather than reading it back out of `@inithium/store`'s shared
 * mutable state, since that state can end up in a different module instance than the one the
 * host app wrote to, depending on how the bundler splits chunks.
 */
export const sendErrorReport = (apiOrigin: string, payload: ErrorReportPayload): void => {
  try {
    void fetch(`${apiOrigin}/error-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => undefined);
  } catch {
    // A reporter that itself throws risks an infinite loop — always swallow.
  }
};

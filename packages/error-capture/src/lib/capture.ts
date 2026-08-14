import { getOrCreateSessionId } from './session-id.js';
import { shouldSendReport } from './throttle.js';
import { sendErrorReport } from './transport.js';

export interface InitErrorCaptureOptions {
  readonly appId: string;
  readonly apiOrigin: string;
  readonly getUserId?: () => string | undefined;
}

export interface ReportErrorContext {
  readonly route?: string;
}

let activeAppId: string | undefined;
let activeApiOrigin: string | undefined;
let activeGetUserId: (() => string | undefined) | undefined;

const extractMessageAndStack = (error: unknown): { readonly message: string; readonly stack?: string } => {
  if (error instanceof Error) return { message: error.message, stack: error.stack };
  if (typeof error === 'string') return { message: error };
  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: 'Unknown error' };
  }
};

const dispatchReport = (message: string, stack: string | undefined, route: string): void => {
  const appId = activeAppId;
  const apiOrigin = activeApiOrigin;
  if (!appId || !apiOrigin) return;

  if (!shouldSendReport(`${appId}:${message}`)) return;

  sendErrorReport(apiOrigin, {
    message,
    stack,
    appId,
    route,
    userAgent: typeof navigator === 'undefined' ? undefined : navigator.userAgent,
    userId: activeGetUserId?.(),
    sessionId: getOrCreateSessionId()
  });
};

/** Convention for app code to explicitly report a caught-but-serious error. */
export const reportError = (error: unknown, context: ReportErrorContext = {}): void => {
  const { message, stack } = extractMessageAndStack(error);
  const route = context.route ?? (typeof location === 'undefined' ? '' : location.pathname);
  dispatchReport(message, stack, route);
};

/** Installs global uncaught-error and unhandled-rejection listeners. Call once at app bootstrap. */
export const initErrorCapture = (options: InitErrorCaptureOptions): void => {
  activeAppId = options.appId;
  activeApiOrigin = options.apiOrigin;
  activeGetUserId = options.getUserId;

  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event: ErrorEvent) => {
    if (!event.error) return;
    reportError(event.error);
  });

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    reportError(event.reason);
  });
};

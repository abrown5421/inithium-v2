const SESSION_ID_STORAGE_KEY = 'inithium:error-capture:session-id';

/** Anonymous, client-generated id — not tied to identity, purely for support correlation. */
export const getOrCreateSessionId = (): string | undefined => {
  if (typeof window === 'undefined' || !window.localStorage) return undefined;

  try {
    const existing = window.localStorage.getItem(SESSION_ID_STORAGE_KEY);
    if (existing) return existing;

    const next = crypto.randomUUID();
    window.localStorage.setItem(SESSION_ID_STORAGE_KEY, next);
    return next;
  } catch {
    return undefined;
  }
};

const COOLDOWN_MS = 10_000;
const MAX_REPORTS_PER_PAGE_LOAD = 20;

const lastSentAtByKey = new Map<string, number>();
let reportsSentThisPageLoad = 0;

/**
 * First line of defense against a render-loop bug flooding the network before the tab dies.
 * The server-side dedup upsert is the durable backstop for anything that gets past this.
 */
export const shouldSendReport = (key: string): boolean => {
  if (reportsSentThisPageLoad >= MAX_REPORTS_PER_PAGE_LOAD) return false;

  const now = Date.now();
  const lastSentAt = lastSentAtByKey.get(key);
  if (lastSentAt !== undefined && now - lastSentAt < COOLDOWN_MS) return false;

  lastSentAtByKey.set(key, now);
  reportsSentThisPageLoad += 1;
  return true;
};

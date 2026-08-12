export interface InactivityTrackerOptions {
  readonly thresholdMs: number;
  readonly onIdle: () => void;
}

export interface InactivityTracker {
  readonly recordActivity: () => void;
  readonly dispose: () => void;
}

export const createInactivityTracker = (options: InactivityTrackerOptions): InactivityTracker => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const scheduleIdleCheck = (): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(options.onIdle, options.thresholdMs);
  };

  const recordActivity = (): void => {
    scheduleIdleCheck();
  };

  const dispose = (): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };

  scheduleIdleCheck();

  return { recordActivity, dispose };
};

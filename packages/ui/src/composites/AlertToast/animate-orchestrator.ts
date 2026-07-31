import type { AnimateEntry, AnimateExit } from '@inithium/types';

const ANIMATE_CSS_BASE_CLASS = 'animate__animated';
const ANIMATE_CSS_PREFIX = 'animate__';
const DEFAULT_ANIMATION_TIMEOUT_MS = 1000;

const buildAnimateClassNames = (animation: AnimateEntry | AnimateExit): readonly string[] => [
  ANIMATE_CSS_BASE_CLASS,
  `${ANIMATE_CSS_PREFIX}${animation}`
];

const waitForAnimationEnd = (
  element: HTMLElement,
  timeoutMs: number = DEFAULT_ANIMATION_TIMEOUT_MS
): Promise<void> =>
  new Promise((resolve) => {
    let settled = false;

    const finish = (): void => {
      if (settled) {
        return;
      }
      settled = true;
      element.removeEventListener('animationend', finish);
      window.clearTimeout(timer);
      resolve();
    };

    const timer = window.setTimeout(finish, timeoutMs);
    element.addEventListener('animationend', finish, { once: true });
  });

export const playEntranceAnimation = (
  element: HTMLElement,
  animation: AnimateEntry,
  timeoutMs: number = DEFAULT_ANIMATION_TIMEOUT_MS
): (() => void) => {
  const classNames = buildAnimateClassNames(animation);
  element.classList.add(...classNames);

  const cleanup = (): void => {
    element.classList.remove(...classNames);
  };

  void waitForAnimationEnd(element, timeoutMs).then(cleanup);

  return cleanup;
};

export const playExitAnimation = async (
  element: HTMLElement,
  animation: AnimateExit,
  timeoutMs: number = DEFAULT_ANIMATION_TIMEOUT_MS
): Promise<void> => {
  const classNames = buildAnimateClassNames(animation);
  element.classList.add(...classNames);
  await waitForAnimationEnd(element, timeoutMs);
  element.classList.remove(...classNames);
};

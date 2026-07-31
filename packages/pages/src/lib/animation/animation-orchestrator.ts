import { AnimateEntry, AnimateExit } from '@inithium/types';

const ANIMATE_CSS_BASE_CLASS = 'animate__animated';
const ANIMATE_CSS_PREFIX = 'animate__';
export const DEFAULT_ANIMATION_TIMEOUT_MS = 1000;

export const buildAnimateClassNames = (animation: AnimateEntry | AnimateExit): readonly string[] => [
  ANIMATE_CSS_BASE_CLASS,
  `${ANIMATE_CSS_PREFIX}${animation}`
];

// Route transitions can land on a reused DOM node (React reconciles the
// container in place rather than remounting it), so a class left over from
// the previous animation can still be attached when the next one starts.
// Clear it defensively before applying the new one so the two never collide.
const clearAnimateClasses = (element: HTMLElement): void => {
  const stale = Array.from(element.classList).filter((className) => className.startsWith(ANIMATE_CSS_PREFIX));
  if (stale.length > 0) {
    element.classList.remove(...stale);
  }
};

export const waitForAnimationEnd = (
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
  clearAnimateClasses(element);
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
  clearAnimateClasses(element);
  const classNames = buildAnimateClassNames(animation);
  element.classList.add(...classNames);
  await waitForAnimationEnd(element, timeoutMs);
  // Leave the classes on: animate.css uses animation-fill-mode: both, so the
  // element stays hidden until the caller unmounts it. Stripping them here would
  // snap the element back to visible for a frame before the route swap commits.
  // (Any staleness gets cleared at the start of whichever animation runs next.)
};

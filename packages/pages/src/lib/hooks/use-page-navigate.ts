import * as React from 'react';
import { resolvePath, useLocation, useNavigate } from 'react-router-dom';
import { playExitAnimation } from '../animation/animation-orchestrator.js';
import { usePageTransitionContext } from '../transition/page-transition-context.js';

export interface PageNavigateOptions {
  readonly replace?: boolean;
  readonly state?: unknown;
}

export type PageNavigate = (to: string, options?: PageNavigateOptions) => Promise<void>;

export const usePageNavigate = (): PageNavigate => {
  const navigate = useNavigate();
  const location = useLocation();
  const { containerRef, activePage } = usePageTransitionContext();

  return React.useCallback(
    async (to: string, options?: PageNavigateOptions) => {
      const target = resolvePath(to, location.pathname);
      const isSameLocation = target.pathname === location.pathname && target.search === location.search;
      if (isSameLocation) {
        return;
      }

      const node = containerRef.current;
      if (node && activePage) {
        await playExitAnimation(node, activePage.animations.exit);
      }
      navigate(to, options);
    },
    [navigate, location, containerRef, activePage]
  );
};

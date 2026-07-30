import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { playExitAnimation } from '../animation/animation-orchestrator.js';
import { usePageTransitionContext } from '../transition/page-transition-context.js';

export interface PageNavigateOptions {
  readonly replace?: boolean;
  readonly state?: unknown;
}

export type PageNavigate = (to: string, options?: PageNavigateOptions) => Promise<void>;

export const usePageNavigate = (): PageNavigate => {
  const navigate = useNavigate();
  const { containerRef, activePage } = usePageTransitionContext();

  return React.useCallback(
    async (to: string, options?: PageNavigateOptions) => {
      const node = containerRef.current;
      if (node && activePage) {
        await playExitAnimation(node, activePage.animations.exit);
      }
      navigate(to, options);
    },
    [navigate, containerRef, activePage]
  );
};

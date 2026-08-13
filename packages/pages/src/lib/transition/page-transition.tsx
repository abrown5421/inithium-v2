import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Page } from '@inithium/models';
import { playEntranceAnimation } from '../animation/animation-orchestrator.js';
import { resolvePageThemeStyle } from '../theme/theme-style.js';
import { usePageTransitionContext } from './page-transition-context.js';

export interface PageTransitionProps {
  readonly page: Page;
  readonly children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ page, children }) => {
  const { containerRef, setActivePage } = usePageTransitionContext();
  const localRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  React.useLayoutEffect(() => {
    setActivePage(page);
    containerRef.current = localRef.current;
    const node = localRef.current;
    if (!node) {
      return;
    }
    return playEntranceAnimation(node, page.animations.entrance);
    // Two different URLs (e.g. /profile/A and /profile/B) can match the same
    // Page document and Route element, so page._id alone doesn't change on
    // navigation between them — location must be tracked too, or the entrance
    // animation never replays and the container stays stuck in its exited state.
  }, [page._id, location.pathname, location.search]);

  return (
    <div ref={localRef} className="flex flex-1 flex-col" style={resolvePageThemeStyle(page.theme)}>
      {children}
    </div>
  );
};

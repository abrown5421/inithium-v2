import * as React from 'react';
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

  React.useLayoutEffect(() => {
    setActivePage(page);
    containerRef.current = localRef.current;
    const node = localRef.current;
    if (!node) {
      return;
    }
    return playEntranceAnimation(node, page.animations.entrance);
  }, [page._id]);

  return (
    <div ref={localRef} className="flex flex-1 flex-col" style={resolvePageThemeStyle(page.theme)}>
      {children}
    </div>
  );
};

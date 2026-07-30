import * as React from 'react';
import { Page } from '@inithium/models';

export interface PageTransitionContextValue {
  readonly containerRef: React.RefObject<HTMLDivElement | null>;
  readonly activePage: Page | null;
  readonly setActivePage: (page: Page) => void;
}

const PageTransitionContext = React.createContext<PageTransitionContextValue | null>(null);

export interface PageTransitionProviderProps {
  readonly children: React.ReactNode;
}

export const PageTransitionProvider: React.FC<PageTransitionProviderProps> = ({ children }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [activePage, setActivePage] = React.useState<Page | null>(null);

  const value = React.useMemo<PageTransitionContextValue>(
    () => ({ containerRef, activePage, setActivePage }),
    [activePage]
  );

  return <PageTransitionContext.Provider value={value}>{children}</PageTransitionContext.Provider>;
};

export const usePageTransitionContext = (): PageTransitionContextValue => {
  const context = React.useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransitionContext must be used within a PageTransitionProvider');
  }
  return context;
};

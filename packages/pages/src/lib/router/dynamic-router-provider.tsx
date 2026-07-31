import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Page } from '@inithium/models';
import { AccessEvaluationConfig } from '../access-control/access-control.js';
import { FallbackComponents, NotFoundPage } from '../fallback/index.js';
import { AccessGuard } from '../guard/access-guard.js';
import { selectActivePagesForApp } from '../route-selection/route-selection.js';
import { PageTransition } from '../transition/page-transition.js';

export type PageLayoutComponent = React.ComponentType<{ readonly page: Page }>;

export type PageLayoutRegistry = Readonly<Record<string, PageLayoutComponent>>;

export interface DynamicRouterProviderProps {
  readonly pages: readonly Page[];
  readonly app: string;
  readonly layouts: PageLayoutRegistry;
  readonly config: AccessEvaluationConfig;
  readonly fallbackComponents?: Partial<FallbackComponents>;
}

const renderPageLayout = (page: Page, layouts: PageLayoutRegistry): React.ReactNode => {
  const Layout = layouts[page.metadata.layout] ?? layouts['default'];
  if (!Layout) {
    throw new Error(`No layout registered for page "${page.route}" (layout: "${page.metadata.layout}")`);
  }
  return <Layout page={page} />;
};

export const DynamicRouterProvider: React.FC<DynamicRouterProviderProps> = ({
  pages,
  app,
  layouts,
  config,
  fallbackComponents
}) => {
  const activePages = React.useMemo(() => selectActivePagesForApp(pages, app), [pages, app]);

  return (
    <Routes>
      {activePages.map((page) => (
        <Route
          key={page._id}
          path={page.route}
          element={
            <AccessGuard page={page} config={config} fallbackComponents={fallbackComponents}>
              <PageTransition page={page}>{renderPageLayout(page, layouts)}</PageTransition>
            </AccessGuard>
          }
        />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

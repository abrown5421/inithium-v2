import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReadAllPagesQuery } from '@inithium/store';
import { Page } from '@inithium/models';
import {
  ANONYMOUS_SESSION,
  DynamicRouterProvider,
  PageSessionProvider,
  RouterNavLink,
  toNavbarMenuItem,
  useNavEntries,
  usePageSession
} from '@inithium/pages';
import { AppShell, Navbar, Spinner } from '@inithium/ui';
import { DashboardPage, LoginPage } from '@inithium/cms-pages';

const layouts = {
  default: DashboardPage,
  login: LoginPage
};

const config = { loginRoute: '/login', defaultAuthenticatedRoute: '/dashboard' };

interface AppShellWithNavProps {
  readonly pages: readonly Page[];
  readonly isLoading: boolean;
}

const AppShellWithNav: React.FC<AppShellWithNavProps> = ({ pages, isLoading }) => {
  const navigate = useNavigate();
  const session = usePageSession();
  const mainMenuItems = useNavEntries(pages, 'cms', 'cms', config).map(toNavbarMenuItem);
  const profileMenuItems = useNavEntries(pages, 'cms', 'profile', config).map(toNavbarMenuItem);

  return (
    <AppShell
      navbar={
        <Navbar
          title="Inithium CMS"
          homeHref="/"
          mainMenuItems={mainMenuItems}
          profileMenuItems={profileMenuItems}
          isAuthenticated={session.isAuthenticated}
          linkComponent={RouterNavLink}
          onLoginClick={() => navigate(config.loginRoute)}
        />
      }
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <DynamicRouterProvider pages={pages} app="cms" layouts={layouts} config={config} />
      )}
    </AppShell>
  );
};

const App: React.FC = () => {
  const { data, isLoading } = useReadAllPagesQuery({ limit: 100 });

  return (
    <PageSessionProvider value={ANONYMOUS_SESSION}>
      <AppShellWithNav pages={data?.data ?? []} isLoading={isLoading} />
    </PageSessionProvider>
  );
};

export default App;

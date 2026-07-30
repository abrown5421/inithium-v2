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
import { HomePage, LoginPage, SignupPage } from '@inithium/web-pages';

const layouts = {
  default: HomePage,
  login: LoginPage,
  signup: SignupPage
};

const config = { loginRoute: '/login', defaultAuthenticatedRoute: '/dashboard' };

interface AppShellWithNavProps {
  readonly pages: readonly Page[];
  readonly isLoading: boolean;
}

const AppShellWithNav: React.FC<AppShellWithNavProps> = ({ pages, isLoading }) => {
  const navigate = useNavigate();
  const session = usePageSession();
  const mainMenuItems = useNavEntries(pages, 'web', 'main', config).map(toNavbarMenuItem);
  const profileMenuItems = useNavEntries(pages, 'web', 'profile', config).map(toNavbarMenuItem);

  return (
    <AppShell
      navbar={
        <Navbar
          title="Inithium"
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
        <DynamicRouterProvider pages={pages} app="web" layouts={layouts} config={config} />
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

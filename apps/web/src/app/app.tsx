import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectIsAuthenticated, useAppSelector, useLogoutMutation, useMeQuery, useReadAllPagesQuery } from '@inithium/store';
import { Page } from '@inithium/models';
import {
  DynamicRouterProvider,
  PageSession,
  PageSessionProvider,
  RouterNavLink,
  toNavbarMenuItem,
  useNavEntries,
  usePageSession
} from '@inithium/pages';
import { AppShell, Navbar, NavbarUser, Spinner } from '@inithium/ui';
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

const toNavbarUser = (user: ReturnType<typeof selectCurrentUser>): NavbarUser | undefined =>
  user
    ? {
        name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email,
        firstName: user.first_name,
        avatarFallback: (user.first_name ?? user.email).charAt(0).toUpperCase()
      }
    : undefined;

const AppShellWithNav: React.FC<AppShellWithNavProps> = ({ pages, isLoading }) => {
  const navigate = useNavigate();
  const session = usePageSession();
  const currentUser = useAppSelector(selectCurrentUser);
  const [logout] = useLogoutMutation();
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
          user={toNavbarUser(currentUser)}
          linkComponent={RouterNavLink}
          onLoginClick={() => navigate(config.loginRoute)}
          onLogoutClick={() => void logout()}
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
  useMeQuery();

  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const session: PageSession = React.useMemo(
    () => ({ isAuthenticated, role: currentUser?.role }),
    [isAuthenticated, currentUser?.role]
  );

  return (
    <PageSessionProvider value={session}>
      <AppShellWithNav pages={data?.data ?? []} isLoading={isLoading} />
    </PageSessionProvider>
  );
};

export default App;

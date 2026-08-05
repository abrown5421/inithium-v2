import * as React from 'react';
import {
  closeAlert,
  selectAlerts,
  selectCurrentUser,
  selectIsAuthenticated,
  useAppDispatch,
  useAppSelector,
  useLogoutMutation,
  useMeQuery,
  useReadAllPagesQuery,
  useReadAllSettingsQuery
} from '@inithium/store';
import { Page, Setting } from '@inithium/models';
import {
  DynamicRouterProvider,
  PageSession,
  PageSessionProvider,
  PageTransitionProvider,
  RouterNavLink,
  toNavbarMenuItem,
  useNavEntries,
  usePageNavigate,
  usePageSession
} from '@inithium/pages';
import { AlertViewport, AppShell, Navbar, NavbarUser, Spinner } from '@inithium/ui';
import { HomePage, LoginPage, SignupPage } from '@inithium/web-pages';

const layouts = {
  default: HomePage,
  login: LoginPage,
  signup: SignupPage
};

const config = { loginRoute: '/login', defaultAuthenticatedRoute: '/dashboard' };

interface PaginatedSettings {
  readonly data?: readonly Setting[];
}

interface AppShellWithNavProps {
  readonly pages: readonly Page[];
  readonly isLoading: boolean;
}

const extractSettingsMap = (response?: PaginatedSettings): Record<string, unknown> =>
  (response?.data ?? []).reduce<Record<string, unknown>>(
    (acc, item) => ({ ...acc, [item.settingName]: item.settingValue }),
    {}
  );

const toNavbarUser = (user: ReturnType<typeof selectCurrentUser>): NavbarUser | undefined =>
  user
    ? {
        name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email,
        firstName: user.first_name,
        avatarFallback: (user.first_name ?? user.email).charAt(0).toUpperCase()
      }
    : undefined;

const AppShellWithNav: React.FC<AppShellWithNavProps> = ({ pages, isLoading }) => (
  <PageTransitionProvider>
    <AppChrome pages={pages} isLoading={isLoading} />
  </PageTransitionProvider>
);

const AppChrome: React.FC<AppShellWithNavProps> = ({ pages, isLoading }) => {
  const pageNavigate = usePageNavigate();
  const session = usePageSession();
  const { data: settingsData } = useReadAllSettingsQuery();
  const currentUser = useAppSelector(selectCurrentUser);
  const [logout] = useLogoutMutation();

  const settingsMap = React.useMemo(() => extractSettingsMap(settingsData), [settingsData]);

  const siteName = typeof settingsMap['site.name'] === 'string' ? settingsMap['site.name'] : 'Inithium';

  const logoUrl = typeof settingsMap['site.logo'] === 'string' ? settingsMap['site.logo'] : undefined;
  const siteLogo = logoUrl ? { src: logoUrl, alt: siteName } : undefined;

  const mainMenuItems = useNavEntries(pages, 'web', 'main', config).map(toNavbarMenuItem);
  const profileMenuItems = useNavEntries(pages, 'web', 'profile', config).map(toNavbarMenuItem);

  return (
    <AppShell
      navbar={
        <Navbar
          title={siteName}
          logo={siteLogo}
          homeHref="/"
          mainMenuItems={mainMenuItems}
          profileMenuItems={profileMenuItems}
          isAuthenticated={session.isAuthenticated}
          user={toNavbarUser(currentUser)}
          linkComponent={RouterNavLink}
          onLoginClick={() => pageNavigate(config.loginRoute)}
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
  const alerts = useAppSelector(selectAlerts);
  const dispatch = useAppDispatch();

  const session: PageSession = React.useMemo(
    () => ({ isAuthenticated, role: currentUser?.role }),
    [isAuthenticated, currentUser?.role]
  );

  return (
    <PageSessionProvider value={session}>
      <AppShellWithNav pages={data?.data ?? []} isLoading={isLoading} />
      <AlertViewport alerts={alerts} onClose={(id) => dispatch(closeAlert(id))} />
    </PageSessionProvider>
  );
};

export default App;
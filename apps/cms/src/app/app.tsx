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
  useNavbarMenuItems,
  useNavEntries,
  usePageNavigate,
  usePageSession
} from '@inithium/pages';
import { AlertViewport, AppShell, Navbar, NavbarUser, Spinner } from '@inithium/ui';
import {
  AssetManagementPage,
  CMS_ALLOWED_ROLES,
  DashboardPage,
  LoginPage,
  PageManagementPage,
  SettingManagementPage,
  UserManagementPage
} from '@inithium/cms-pages';

const layouts = {
  default: DashboardPage,
  login: LoginPage,
  users: UserManagementPage,
  pages: PageManagementPage,
  assets: AssetManagementPage,
  settings: SettingManagementPage
};

const config = { loginRoute: '/login', defaultAuthenticatedRoute: '/' };

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

const getSettingString = (map: Record<string, unknown>, key: string, fallback: string): string =>
  typeof map[key] === 'string' ? (map[key] as string) : fallback;

const getSettingOptionalString = (map: Record<string, unknown>, key: string): string | undefined =>
  typeof map[key] === 'string' ? (map[key] as string) : undefined;

const createLogoConfig = (logoUrl?: string, altText?: string) =>
  logoUrl ? { src: logoUrl, alt: altText ?? '' } : undefined;

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
  const siteName = React.useMemo(() => getSettingString(settingsMap, 'site.name', 'Inithium CMS'), [settingsMap]);
  const logoUrl = React.useMemo(() => getSettingOptionalString(settingsMap, 'site.logo'), [settingsMap]);
  const siteLogo = React.useMemo(() => createLogoConfig(logoUrl, siteName), [logoUrl, siteName]);

  const mainMenuItems = useNavbarMenuItems(useNavEntries(pages, 'cms', 'cms', config));
  const profileMenuItems = useNavbarMenuItems(useNavEntries(pages, 'cms', 'profile', config));

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
        <DynamicRouterProvider pages={pages} app="cms" layouts={layouts} config={config} />
      )}
    </AppShell>
  );
};

const App: React.FC = () => {
  const { data, isLoading } = useReadAllPagesQuery({ limit: 100 });
  useMeQuery();

  const currentUser = useAppSelector(selectCurrentUser);
  const rawIsAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthenticated = rawIsAuthenticated && CMS_ALLOWED_ROLES.has(currentUser?.role ?? '');
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
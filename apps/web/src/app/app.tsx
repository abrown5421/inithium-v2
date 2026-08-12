import * as React from 'react';
import {
  closeAlert,
  resolveAssetUrl,
  resolveAvatarDisplay,
  resolveAvatarInitials,
  selectAlerts,
  selectCurrentUser,
  selectIsAuthenticated,
  useAppDispatch,
  useAppSelector,
  useLogoutMutation,
  useMeQuery,
  useReadAllPagesQuery,
  useReadAllProfilesQuery,
  useReadAllSettingsQuery
} from '@inithium/store';
import { Page, Profile, Setting } from '@inithium/models';
import {
  DynamicRouterProvider,
  NavHrefParams,
  PageSession,
  PageSessionProvider,
  PageTransitionProvider,
  RouterNavLink,
  useNavbarMenuItems,
  useNavEntries,
  usePageNavigate,
  usePageSession
} from '@inithium/pages';
import {
  AlertViewport,
  AppShell,
  Navbar,
  NavbarUser,
  Spinner,
  parseCoreThemeColors,
  useApplyCoreThemeColors
} from '@inithium/ui';
import { DocumentationPage, HomePage, LoginPage, SignupPage, ProfilePage } from '@inithium/web-pages';

const layouts = {
  default: HomePage,
  documentation: DocumentationPage,
  login: LoginPage,
  signup: SignupPage,
  profile: ProfilePage
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

const toNavbarUser = (user: ReturnType<typeof selectCurrentUser>, profile?: Profile): NavbarUser | undefined =>
  user
    ? {
        name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email,
        firstName: user.first_name,
        avatarFallback: resolveAvatarInitials(user.first_name, user.last_name, user.email),
        ...resolveAvatarDisplay(profile?.profileAvatar)
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
  const { data: myProfileResult } = useReadAllProfilesQuery(
    { field: 'user_id', search: currentUser?.id ?? '', limit: 1 },
    { skip: !currentUser?.id }
  );
  const myProfile = myProfileResult?.data?.[0];

  const settingsMap = React.useMemo(() => extractSettingsMap(settingsData), [settingsData]);

  const themeColors = React.useMemo(() => parseCoreThemeColors(settingsMap['site.theme']), [settingsMap]);
  useApplyCoreThemeColors(themeColors);

  const siteName = typeof settingsMap['site.name'] === 'string' ? settingsMap['site.name'] : 'Inithium';

  const logoUrl = typeof settingsMap['site.logo'] === 'string' ? settingsMap['site.logo'] : undefined;
  const siteLogo = logoUrl ? { src: resolveAssetUrl(logoUrl), alt: siteName } : undefined;

  const navParams: NavHrefParams = React.useMemo(() => ({ id: currentUser?.id }), [currentUser?.id]);

  const mainMenuItems = useNavbarMenuItems(useNavEntries(pages, 'web', 'main', config), navParams);
  const profileMenuItems = useNavbarMenuItems(useNavEntries(pages, 'web', 'profile', config), navParams);

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
          user={toNavbarUser(currentUser, myProfile)}
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
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
  TooltipProvider,
  parseCoreThemeColors,
  useApplyCoreThemeColors
} from '@inithium/ui';
import { PresenceProvider, usePresenceStatus } from '@inithium/presence/react';
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
  const ownPresenceStatus = usePresenceStatus(currentUser?.id);

  const themeColors = React.useMemo(() => parseCoreThemeColors(settingsMap['site.theme']), [settingsMap]);
  useApplyCoreThemeColors(themeColors);

  const siteName = React.useMemo(() => getSettingString(settingsMap, 'site.name', 'Inithium CMS'), [settingsMap]);
  const logoUrl = React.useMemo(() => getSettingOptionalString(settingsMap, 'site.logo'), [settingsMap]);
  const resolvedLogoUrl = React.useMemo(() => (logoUrl ? resolveAssetUrl(logoUrl) : undefined), [logoUrl]);
  const siteLogo = React.useMemo(() => createLogoConfig(resolvedLogoUrl, siteName), [resolvedLogoUrl, siteName]);

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
          user={toNavbarUser(currentUser, myProfile)}
          presenceStatus={ownPresenceStatus}
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
    <TooltipProvider>
      <PresenceProvider>
        <PageSessionProvider value={session}>
          <AppShellWithNav pages={data?.data ?? []} isLoading={isLoading} />
          <AlertViewport alerts={alerts} onClose={(id) => dispatch(closeAlert(id))} />
        </PageSessionProvider>
      </PresenceProvider>
    </TooltipProvider>
  );
};

export default App;
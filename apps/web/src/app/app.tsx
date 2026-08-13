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
  TooltipProvider,
  parseCoreThemeColors,
  useApplyCoreThemeColors
} from '@inithium/ui';
import { PresenceProvider, usePresenceStatus } from '@inithium/presence/react';
import { DocumentationPage, HomePage, LoginPage, SignupPage, ProfilePage } from '@inithium/web-pages';
import {
  createPluginRegistry,
  registerClientPlugins,
  setEnabledPluginIds,
  resolveEnabledPluginIds,
  getPageLayoutContributions,
  getBackgroundComponentContributions,
  mergeRegistryMaps,
  PluginClientRegistryProvider,
  type PluginClientModule
} from '@inithium/plugin-engine/client';
import { plugins as discoveredClientPlugins } from 'virtual:inithium-plugins';

const CORE_WEB_LAYOUTS = {
  default: HomePage,
  documentation: DocumentationPage,
  login: LoginPage,
  signup: SignupPage,
  profile: ProfilePage
};

// Registered once at module scope — `discoveredClientPlugins` is a static, build-time-resolved list.
const basePluginRegistrationResult = registerClientPlugins(
  createPluginRegistry<PluginClientModule>(),
  discoveredClientPlugins
);
if (basePluginRegistrationResult.isErr()) {
  console.error('Failed to register client plugins:', basePluginRegistrationResult.error);
}
const BASE_PLUGIN_REGISTRY = basePluginRegistrationResult.isOk()
  ? basePluginRegistrationResult.value
  : createPluginRegistry<PluginClientModule>();

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
  const ownPresenceStatus = usePresenceStatus(currentUser?.id);

  const themeColors = React.useMemo(() => parseCoreThemeColors(settingsMap['site.theme']), [settingsMap]);
  useApplyCoreThemeColors(themeColors);

  const siteName = typeof settingsMap['site.name'] === 'string' ? settingsMap['site.name'] : 'Inithium';

  const logoUrl = typeof settingsMap['site.logo'] === 'string' ? settingsMap['site.logo'] : undefined;
  const siteLogo = logoUrl ? { src: resolveAssetUrl(logoUrl), alt: siteName } : undefined;

  const navParams: NavHrefParams = React.useMemo(() => ({ id: currentUser?.id }), [currentUser?.id]);

  const mainMenuItems = useNavbarMenuItems(useNavEntries(pages, 'web', 'main', config), navParams);
  const profileMenuItems = useNavbarMenuItems(useNavEntries(pages, 'web', 'profile', config), navParams);

  const pluginRegistry = React.useMemo(() => {
    const discoveredIds = Object.keys(BASE_PLUGIN_REGISTRY.manifests);
    const enabledIds = resolveEnabledPluginIds(discoveredIds, settingsMap['plugins.enabled']);
    return setEnabledPluginIds(BASE_PLUGIN_REGISTRY, enabledIds);
  }, [settingsMap]);

  const layouts = React.useMemo(
    () => mergeRegistryMaps(CORE_WEB_LAYOUTS, getPageLayoutContributions(pluginRegistry)),
    [pluginRegistry]
  );

  const backgroundComponents = React.useMemo(
    () => getBackgroundComponentContributions(pluginRegistry),
    [pluginRegistry]
  );

  return (
    <PluginClientRegistryProvider registry={pluginRegistry}>
      {backgroundComponents.map((BackgroundComponent, index) => (
        <BackgroundComponent key={index} />
      ))}
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
          <DynamicRouterProvider pages={pages} app="web" layouts={layouts} config={config} />
        )}
      </AppShell>
    </PluginClientRegistryProvider>
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

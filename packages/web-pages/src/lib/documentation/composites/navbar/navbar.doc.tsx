import { Navbar, type NavbarMenuItem } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

const MAIN_MENU_ITEMS: readonly NavbarMenuItem[] = [
  { label: 'Dashboard', href: '#', active: true },
  { label: 'Projects', href: '#' },
  { label: 'Reports', href: '#' },
];

const PROFILE_MENU_ITEMS: readonly NavbarMenuItem[] = [
  { label: 'Account settings', href: '#' },
  { label: 'Billing', href: '#' },
];

const NAVBAR_DOC: CompositeDoc = {
  overview: (
    <>
      Navbar is the standard application header: a logo/title slot, an inline desktop menu, and a
      user/account slot that becomes an avatar-triggered drawer on desktop and a full navigation drawer
      on mobile — both routed through the same NavDrawer + NavLink building blocks. Routing is fully
      decoupled from any specific router via the optional linkComponent prop (defaults to a plain
      anchor). Enterprise use cases: the single shared header for apps/web and apps/cms, both of which
      wire it to site.name/site.logo and the current session.
    </>
  ),
  importStatement: "import { Navbar } from '@inithium/ui';",
  composition: [
    { name: 'LogoSlot', role: 'Renders the logo image and/or site title, linking home.' },
    { name: 'MenuSlot', role: "Inline desktop menu (hidden below the lg breakpoint), rendering mainMenuItems via NavLink." },
    { name: 'UserSlot', role: 'Avatar + account drawer when authenticated, or a Log In button/drawer otherwise; renders differently above/below lg.' },
    { name: 'NavDrawer', role: 'Sheet-based mobile/account menu with grouped link sections and a single footer action.' },
    { name: 'NavLink', role: 'Renders one menu item as either a plain link or (isButton) a solid Button, both via linkComponent.' },
  ],
  propGroups: [
    {
      component: 'Navbar',
      props: [
        { name: 'logo', type: '{ src: string; alt?: string }', description: 'Logo image. Omit to show title-only.' },
        { name: 'title', type: 'string', description: 'Site name shown beside (or instead of) the logo.' },
        { name: 'homeHref', type: 'string', defaultValue: "'/'", description: 'Link target for the logo/title.' },
        { name: 'mainMenuItems', type: 'readonly NavbarMenuItem[]', required: true, description: 'Primary navigation links, shown inline on desktop and in the mobile drawer.' },
        { name: 'profileMenuItems', type: 'readonly NavbarMenuItem[]', required: true, description: "Account-scoped links, shown only in the authenticated user's drawer." },
        { name: 'isAuthenticated', type: 'boolean', required: true, description: 'Switches UserSlot between the avatar/account drawer and the Log In affordance.' },
        { name: 'user', type: 'NavbarUser', description: 'Display name/avatar for the authenticated user.' },
        { name: 'onLoginClick', type: '() => void', description: 'Called from the Log In button.' },
        { name: 'onLogoutClick', type: '() => void', description: "Called from the drawer's Log Out footer action." },
        { name: 'linkComponent', type: 'React.ComponentType<NavbarLinkComponentProps>', description: 'Overrides the default anchor renderer, e.g. a router\'s Link component.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Authenticated header',
      code: `<Navbar
  title="Acme Corp"
  mainMenuItems={mainMenuItems}
  profileMenuItems={profileMenuItems}
  isAuthenticated
  user={{ name: 'Jordan Lee', avatarFallback: 'JL' }}
  onLogoutClick={handleLogout}
/>`,
      preview: (
        <div className="w-full">
          <Navbar
            title="Acme Corp"
            mainMenuItems={MAIN_MENU_ITEMS}
            profileMenuItems={PROFILE_MENU_ITEMS}
            isAuthenticated
            user={{ name: 'Jordan Lee', avatarFallback: 'JL' }}
          />
        </div>
      ),
    },
    {
      title: 'Signed-out header',
      code: `<Navbar
  title="Acme Corp"
  mainMenuItems={mainMenuItems}
  profileMenuItems={[]}
  isAuthenticated={false}
  onLoginClick={handleLogin}
/>`,
      preview: (
        <div className="w-full">
          <Navbar
            title="Acme Corp"
            mainMenuItems={MAIN_MENU_ITEMS}
            profileMenuItems={[]}
            isAuthenticated={false}
          />
        </div>
      ),
    },
  ],
};

export const NavbarDoc = () => <CompositeDocView doc={NAVBAR_DOC} />;

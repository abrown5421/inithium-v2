import {
  AuthField,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Navbar,
} from '@inithium/ui';
import type { DocumentationSection } from '../documentation-page.types.js';

const NAVBAR_MAIN_MENU_ITEMS = [
  { label: 'Overview', href: '#', active: true },
  { label: 'Components', href: '#' },
  { label: 'Guides', href: '#' },
] as const;

const NAVBAR_PROFILE_MENU_ITEMS = [
  { label: 'Account settings', href: '#' },
  { label: 'Sign out', href: '#' },
] as const;

export const COMPOSITES_SECTION: DocumentationSection = {
  id: 'composites',
  label: 'Molecular Composites',
  description:
    'Higher-level components composed from the primitives above, each adding its own prop-passing and layout conventions. Some names below stand in for what a generic UI kit might call "FormField" or "Modal" — see the note on each card for the mapping.',
  components: [
    {
      id: 'navbar',
      name: 'Navbar',
      summary: 'App chrome header composing Button (as links), Avatar, and a responsive Sheet-based drawer on small screens.',
      importStatement: "import { Navbar } from '@inithium/ui';",
      usageCode: `<Navbar
  title="Inithium"
  homeHref="/"
  mainMenuItems={mainMenuItems}
  profileMenuItems={profileMenuItems}
  isAuthenticated
  user={{ name: 'Ada Lovelace', avatarFallback: 'AL' }}
  onLogoutClick={handleLogout}
/>`,
      preview: (
        <div className="w-full overflow-hidden rounded-md border border-border">
          <Navbar
            title="Inithium"
            homeHref="#"
            mainMenuItems={NAVBAR_MAIN_MENU_ITEMS}
            profileMenuItems={NAVBAR_PROFILE_MENU_ITEMS}
            isAuthenticated
            user={{ name: 'Ada Lovelace', firstName: 'Ada', avatarFallback: 'AL' }}
          />
        </div>
      ),
      props: [
        { name: 'mainMenuItems', type: 'readonly NavbarMenuItem[]', required: true, description: 'Primary nav links: { label, href, isButton?, active? }.' },
        { name: 'profileMenuItems', type: 'readonly NavbarMenuItem[]', required: true, description: 'Links shown in the authenticated user menu / drawer.' },
        { name: 'isAuthenticated', type: 'boolean', required: true, description: 'Toggles the Log In button vs. the user avatar menu.' },
        { name: 'user', type: 'NavbarUser', description: '{ name?, firstName?, avatarSrc?, avatarFallback? } shown in the account menu.' },
        { name: 'logo / title / homeHref', type: 'NavbarLogo | string | string', description: 'Left-side branding; clicking navigates to homeHref (or calls onLogoClick).' },
        { name: 'onLoginClick / onLogoutClick', type: '() => void', description: 'Handlers for the login button and the drawer/menu log-out action.' },
        { name: 'linkComponent', type: 'React.ComponentType<NavbarLinkComponentProps>', description: 'Swap in a router Link (e.g. RouterNavLink); defaults to a plain <a>.' },
      ],
    },
    {
      id: 'auth-field',
      name: 'AuthField',
      summary: 'Label + Input + inline error Text, wired together with matching ids and aria-describedby.',
      importStatement: "import { AuthField } from '@inithium/ui';",
      usageCode: `<AuthField label="Email" type="email" required placeholder="you@example.com" />
<AuthField label="Email" type="email" defaultValue="not-an-email" errorMessage="Enter a valid email address" />`,
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-4">
          <AuthField label="Email" type="email" placeholder="you@example.com" required />
          <AuthField
            label="Email"
            type="email"
            defaultValue="not-an-email"
            errorMessage="Enter a valid email address"
          />
        </div>
      ),
      props: [
        { name: 'label', type: 'string', required: true, description: 'Rendered via Label above the Input.' },
        { name: 'errorMessage', type: 'string', description: 'When present, renders below the field and links it via aria-describedby.' },
        { name: 'containerClassName', type: 'string', description: 'className applied to the wrapping flex column.' },
        { name: '(all InputProps)', type: 'InputProps', description: 'AuthField extends Input — id, value, onChange, error, color, etc. all pass through.' },
      ],
      notes: '@inithium/ui has no component literally named "FormField" — AuthField is the equivalent composition (Label + Input + error Text) and is the pattern to follow for any labeled field.',
    },
    {
      id: 'dialog',
      name: 'Dialog',
      summary: 'Radix-based modal: overlay, centered content panel, header/footer slots, and a built-in close button.',
      importStatement:
        "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@inithium/ui';",
      usageCode: `<Dialog>
  <DialogTrigger asChild>
    <Button variant="outlined">Open dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete asset</DialogTitle>
      <DialogDescription>This action can't be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outlined">Cancel</Button>
      </DialogClose>
      <Button color="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
      preview: (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outlined">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete asset</DialogTitle>
              <DialogDescription>This action can&apos;t be undone. The asset will be permanently removed.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outlined">Cancel</Button>
              </DialogClose>
              <Button color="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
      props: [
        { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open: boolean) => void', description: 'Controlled/uncontrolled open state, set on the root Dialog (from @radix-ui/react-dialog).' },
        { name: 'showCloseButton', type: 'boolean', defaultValue: 'true', description: 'DialogContent-only: whether to render the built-in top-right close button.' },
      ],
      notes: '@inithium/ui has no component literally named "Modal" — Dialog (built on @radix-ui/react-dialog) is the equivalent; AlertDialog is the confirm-style variant and Sheet is the slide-in-drawer variant.',
    },
    {
      id: 'card-group-pattern',
      name: 'Card grid (composition pattern)',
      summary: 'Multiple Cards composed inside a plain grid container — the repo convention in place of a dedicated "CardGroup" component.',
      importStatement: "import { Card, CardHeader, CardTitle, CardContent } from '@inithium/ui';",
      usageCode: `<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text size="sm" color="muted">{item.description}</Text>
      </CardContent>
    </Card>
  ))}
</div>`,
      preview: (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { id: 'api', title: 'API', status: 'success' as const, statusLabel: 'Operational' },
            { id: 'pubsub', title: 'Pub/Sub', status: 'success' as const, statusLabel: 'Operational' },
            { id: 'cms', title: 'CMS', status: 'warning' as const, statusLabel: 'Degraded' },
          ].map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge color={item.status}>{item.statusLabel}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
      props: [],
      notes: '@inithium/ui has no dedicated "CardGroup" primitive — the established convention (see login-page.tsx, signup-page.tsx) is a plain Tailwind grid/flex div wrapping several Cards.',
    },
  ],
};

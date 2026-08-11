import { AppShell, Text } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

const DemoNavbar = () => (
  <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
    <Text weight="semibold">Acme Corp</Text>
    <Text size="sm" color="muted">Navbar slot</Text>
  </div>
);

const APP_SHELL_DOC: CompositeDoc = {
  overview: (
    <>
      AppShell is the outermost layout wrapper every page in apps/web and apps/cms mounts into: a sticky
      navbar slot above a flexed main content area, both stacked in a full-viewport-height column. It
      owns no navigation or session logic itself — Navbar (or any other header) is passed in as a plain
      React node. Enterprise use cases: the single top-level layout every authenticated and public route
      shares, keeping the header pinned while route content scrolls beneath it.
    </>
  ),
  importStatement: "import { AppShell } from '@inithium/ui';",
  composition: [
    { name: 'navbar slot', role: "Optional React.ReactNode rendered in a sticky (top-0, z-40) wrapper above the content — typically the Navbar composite, but AppShell doesn't import or assume it." },
    { name: 'main', role: 'Flex-column content area that grows to fill remaining height below the navbar.' },
  ],
  propGroups: [
    {
      component: 'AppShell',
      props: [
        { name: 'navbar', type: 'React.ReactNode', description: 'Rendered sticky above the content. Omit for a shell with no header.' },
        { name: 'children', type: 'React.ReactNode', required: true, description: 'Page content, rendered inside the flexed main area.' },
        { name: 'className', type: 'string', description: 'Merged onto the outer full-height column.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Shell with a sticky header',
      description: 'Height is constrained here for the preview; in the real app AppShell fills the viewport (min-h-dvh).',
      code: `<AppShell navbar={<Navbar {...navbarProps} />}>
  <main className="flex-1 p-6">Route content renders here.</main>
</AppShell>`,
      preview: (
        <AppShell navbar={<DemoNavbar />} className="min-h-0 w-full rounded-lg border border-border">
          <div className="flex flex-1 items-center justify-center p-8">
            <Text size="sm" color="muted">Page content renders here</Text>
          </div>
        </AppShell>
      ),
    },
  ],
};

export const AppShellDoc = () => <CompositeDocView doc={APP_SHELL_DOC} />;

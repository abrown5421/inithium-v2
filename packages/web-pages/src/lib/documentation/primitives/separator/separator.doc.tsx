import { Separator, Text } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const SEPARATOR_DOC: PrimitiveDoc = {
  overview: (
    <>
      Separator draws a thin, border-colored divider between grouped content, horizontally or
      vertically, and is marked decorative (<code>aria-hidden</code>) by default so it never clutters the
      accessibility tree. Enterprise use cases include dividing toolbar action groups, separating
      metadata rows inside a card, and splitting a two-pane settings layout.
    </>
  ),
  importStatement: "import { Separator } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Separator',
      props: [
        { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Direction of the divider line.' },
        { name: 'decorative', type: 'boolean', defaultValue: 'true', description: 'When true, hides the separator from assistive tech since it carries no semantic meaning.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Horizontal divider between sections',
      code: `<Text weight="medium">Account settings</Text>
<Separator />
<Text size="sm" color="muted">Manage your profile and preferences.</Text>`,
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Text weight="medium">Account settings</Text>
          <Separator />
          <Text size="sm" color="muted">Manage your profile and preferences.</Text>
        </div>
      ),
    },
    {
      title: 'Vertical divider in a toolbar',
      description: 'Vertical separators need an explicit height from their parent, since they render at `h-full`.',
      code: `<div className="flex h-5 items-center gap-3">
  <Text size="sm">Edit</Text>
  <Separator orientation="vertical" />
  <Text size="sm">Duplicate</Text>
  <Separator orientation="vertical" />
  <Text size="sm">Delete</Text>
</div>`,
      preview: (
        <div className="flex h-5 items-center gap-3">
          <Text size="sm">Edit</Text>
          <Separator orientation="vertical" />
          <Text size="sm">Duplicate</Text>
          <Separator orientation="vertical" />
          <Text size="sm">Delete</Text>
        </div>
      ),
    },
  ],
};

export const SeparatorDoc = () => <PrimitiveDocView doc={SEPARATOR_DOC} />;

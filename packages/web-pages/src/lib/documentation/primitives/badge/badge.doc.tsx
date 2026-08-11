import { Badge } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const BADGE_DOC: PrimitiveDoc = {
  overview: (
    <>
      Badge is a compact status or label pill for tags, counts, and state indicators, sharing the same
      8-token color palette and solid/outlined treatment as Button. Enterprise use cases include table
      row status chips, notification counts, and plan or tier labels in account settings.
    </>
  ),
  importStatement: "import { Badge } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Badge',
      props: [
        { name: 'variant', type: "'solid' | 'outlined'", defaultValue: "'solid'", description: 'Visual treatment of the badge.' },
        { name: 'color', type: 'ColorToken', defaultValue: "'primary' (solid only)", description: 'One of the 8 core theme tokens, or a literal Tailwind shade. Omit on `outlined` for a neutral border.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Merges badge styling onto its immediate child, e.g. an <a>.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Status pills',
      code: `<Badge color="primary">New</Badge>
<Badge color="success">Live</Badge>
<Badge color="warning">Pending</Badge>
<Badge color="destructive">Failed</Badge>
<Badge color="red-700">Blocked</Badge>`,
      preview: (
        <>
          <Badge color="primary">New</Badge>
          <Badge color="success">Live</Badge>
          <Badge color="warning">Pending</Badge>
          <Badge color="destructive">Failed</Badge>
          <Badge color="red-700">Blocked</Badge>
        </>
      ),
    },
    {
      title: 'Outlined tags',
      description: 'Omit `color` on `outlined` for a neutral border, or pair it with a token for a subtler themed tag.',
      code: `<Badge variant="outlined">Draft</Badge>
<Badge variant="outlined" color="info">Beta</Badge>
<Badge variant="outlined" color="destructive">Archived</Badge>`,
      preview: (
        <>
          <Badge variant="outlined">Draft</Badge>
          <Badge variant="outlined" color="info">Beta</Badge>
          <Badge variant="outlined" color="destructive">Archived</Badge>
        </>
      ),
    },
  ],
};

export const BadgeDoc = () => <PrimitiveDocView doc={BADGE_DOC} />;

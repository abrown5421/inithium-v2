import { Text } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const TEXT_DOC: PrimitiveDoc = {
  overview: (
    <>
      Text is the base typography primitive for body copy, inline labels, and table cell content. It
      exposes a constrained size, weight, and font-family scale plus the same 8-token color palette used
      across every colored primitive, so prose stays visually consistent with buttons, badges, and
      alerts. In enterprise dashboards it is the workhorse for mixing muted metadata with emphasized
      values, form helper text, and status copy.
    </>
  ),
  importStatement: "import { Text } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Text',
      props: [
        { name: 'as', type: "'p' | 'span' | 'div' | 'label' | 'small'", defaultValue: "'p'", description: 'Underlying HTML element rendered.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Merges text styling onto its immediate child instead of rendering `as`.' },
        { name: 'size', type: "'xs' | 'sm' | 'base' | 'lg' | 'xl'", defaultValue: "'base'", description: 'Font-size scale step.' },
        { name: 'weight', type: "'normal' | 'medium' | 'semibold' | 'bold'", defaultValue: "'normal'", description: 'Font-weight scale step.' },
        { name: 'font', type: "'primary' | 'secondary' | 'sans' | 'serif' | 'mono'", defaultValue: "'sans'", description: 'Font-family variant.' },
        { name: 'color', type: "'default' | ColorToken", defaultValue: "'default'", description: "One of the 8 core theme tokens, a literal Tailwind shade, or 'default' for text-foreground." },
      ],
    },
  ],
  examples: [
    {
      title: 'Size & weight scale',
      description: 'Combine size, weight, and font to establish a visual hierarchy without leaving the Text component.',
      code: `<Text size="xs" color="muted">Extra small muted</Text>
<Text size="sm" weight="medium">Small medium</Text>
<Text size="lg" weight="semibold">Large semibold</Text>
<Text size="xl" weight="bold" font="secondary">Extra large bold</Text>`,
      preview: (
        <div className="flex flex-col gap-1">
          <Text size="xs" color="muted">Extra small muted</Text>
          <Text size="sm" weight="medium">Small medium</Text>
          <Text size="lg" weight="semibold">Large semibold</Text>
          <Text size="xl" weight="bold" font="secondary">Extra large bold</Text>
        </div>
      ),
    },
    {
      title: 'Themed inline status text',
      description: 'Apply a core color token to inline `span` text for status or severity copy.',
      code: `<Text as="span" color="success">Payment succeeded</Text>
<Text as="span" color="destructive">3 errors found</Text>
<Text as="span" color="info">Sync in progress</Text>`,
      preview: (
        <div className="flex flex-col gap-1">
          <Text as="span" color="success">Payment succeeded</Text>
          <Text as="span" color="destructive">3 errors found</Text>
          <Text as="span" color="info">Sync in progress</Text>
        </div>
      ),
    },
  ],
};

export const TextDoc = () => <PrimitiveDocView doc={TEXT_DOC} />;

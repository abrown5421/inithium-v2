import { Button } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const BUTTON_DOC: PrimitiveDoc = {
  overview: (
    <>
      Button is the primary interactive action element across the design system, offering solid,
      outlined, ghost, and link treatments on the same 8-token color palette shared by Badge, Alert, and
      Progress, plus a built-in loading state that swaps the leading icon for a spinner and disables
      interaction. Enterprise use cases include form submit/cancel pairs, destructive confirmation
      actions, and async save buttons that need a loading state without extra wiring.
    </>
  ),
  importStatement: "import { Button } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Button',
      props: [
        { name: 'variant', type: "'solid' | 'outlined' | 'ghost' | 'link'", defaultValue: "'solid'", description: 'Visual treatment of the button.' },
        { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", defaultValue: "'default'", description: 'Controls height/padding, or a square icon-only button.' },
        { name: 'color', type: 'ColorToken', defaultValue: "'primary' (solid only)", description: 'One of the 8 core theme tokens, or a literal Tailwind shade.' },
        { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Swaps leftIcon for a spinner and disables the button.' },
        { name: 'leftIcon', type: 'React.ReactNode', description: 'Icon rendered before the label (hidden while loading).' },
        { name: 'rightIcon', type: 'React.ReactNode', description: 'Icon rendered after the label.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Merges button behavior onto its immediate child instead of rendering a <button>.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Variant & color combinations',
      code: `<Button variant="solid" color="primary">Save changes</Button>
<Button variant="outlined" color="secondary">Cancel</Button>
<Button variant="ghost" color="accent">Ghost</Button>
<Button variant="link" color="info">Learn more</Button>
<Button variant="solid" color="destructive">Delete</Button>
<Button variant="solid" color="emerald-300">Save</Button>`,
      preview: (
        <>
          <Button variant="solid" color="primary">Save changes</Button>
          <Button variant="outlined" color="secondary">Cancel</Button>
          <Button variant="ghost" color="accent">Ghost</Button>
          <Button variant="link" color="info">Learn more</Button>
          <Button variant="solid" color="destructive">Delete</Button>
          <Button variant="solid" color="emerald-300">Save</Button>
        </>
      ),
    },
    {
      title: 'Loading & sizing',
      description: '`loading` disables the button and replaces `leftIcon` with a spinner automatically.',
      code: `<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button loading>Submitting…</Button>
<Button size="icon" variant="outlined" aria-label="Settings">⚙</Button>`,
      preview: (
        <>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button loading>Submitting…</Button>
          <Button size="icon" variant="outlined" aria-label="Settings">⚙</Button>
        </>
      ),
    },
  ],
};

export const ButtonDoc = () => <PrimitiveDocView doc={BUTTON_DOC} />;

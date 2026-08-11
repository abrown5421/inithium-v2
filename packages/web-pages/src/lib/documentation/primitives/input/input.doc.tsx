import { Input } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const INPUT_DOC: PrimitiveDoc = {
  overview: (
    <>
      Input is the native text field styled to the design system, with a built-in error/destructive
      state driven by a single <code>error</code> prop and an optional focus-ring color override.
      Enterprise use cases include validated fields in settings and onboarding flows, and inline search
      boxes.
    </>
  ),
  importStatement: "import { Input } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Input',
      props: [
        { name: 'error', type: 'boolean | string', description: 'Marks the field invalid and switches it to the destructive palette.' },
        { name: 'color', type: 'ColorToken', description: 'Focus-ring and text-selection color. Omit for the neutral default.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Default & error states',
      code: `<Input placeholder="you@example.com" />
<Input placeholder="you@example.com" error defaultValue="not-an-email" />`,
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input placeholder="you@example.com" />
          <Input placeholder="you@example.com" error defaultValue="not-an-email" />
        </div>
      ),
    },
    {
      title: 'Themed focus ring',
      description: 'Pass a core color token to override the neutral focus-ring/selection color.',
      code: `<Input placeholder="Search projects…" color="info" />
<Input placeholder="Search projects…" color="teal-500" />`,
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input placeholder="Search projects…" color="info" />
          <Input placeholder="Search projects…" color="teal-500" />
        </div>
      ),
    },
  ],
};

export const InputDoc = () => <PrimitiveDocView doc={INPUT_DOC} />;

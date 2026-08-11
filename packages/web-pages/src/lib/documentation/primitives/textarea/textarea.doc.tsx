import { Textarea } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const TEXTAREA_DOC: PrimitiveDoc = {
  overview: (
    <>
      Textarea is a multi-line text field that auto-sizes to its content via CSS{' '}
      <code>field-sizing: content</code>, and shares Input's error/destructive treatment. Enterprise use
      cases include comment boxes, notes fields, and description inputs on entity-creation forms.
    </>
  ),
  importStatement: "import { Textarea } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Textarea',
      props: [
        { name: 'error', type: 'boolean | string', description: 'Marks the field invalid and switches it to the destructive palette.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Default & error states',
      code: `<Textarea placeholder="Add a description…" />
<Textarea placeholder="Add a description…" error defaultValue="Too short" />`,
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Textarea placeholder="Add a description…" />
          <Textarea placeholder="Add a description…" error defaultValue="Too short" />
        </div>
      ),
    },
  ],
};

export const TextareaDoc = () => <PrimitiveDocView doc={TEXTAREA_DOC} />;

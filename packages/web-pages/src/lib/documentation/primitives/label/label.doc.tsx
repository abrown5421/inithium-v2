import { Input, Label } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const LABEL_DOC: PrimitiveDoc = {
  overview: (
    <>
      Label pairs with Input, Textarea, Checkbox, Switch, and RadioGroupItem via Radix's peer-aware
      styling (<code>peer-disabled</code>, <code>group-data-disabled</code>) and native{' '}
      <code>htmlFor</code> association, with a built-in required-field asterisk. Enterprise use cases
      include dense settings forms and data-entry panels where required-versus-optional state must read
      unambiguously at a glance.
    </>
  ),
  importStatement: "import { Label } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Label',
      props: [
        { name: 'htmlFor', type: 'string', description: 'Associates the label with a form control by id.' },
        { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Appends a destructive-colored asterisk to mark the field as required.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Label + Input pairing',
      description: '`htmlFor` connects the label to the input for click-to-focus and screen reader association.',
      code: `<Label htmlFor="email">Email address</Label>
<Input id="email" type="email" placeholder="you@example.com" />`,
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-2">
          <Label htmlFor="doc-email">Email address</Label>
          <Input id="doc-email" type="email" placeholder="you@example.com" />
        </div>
      ),
    },
    {
      title: 'Required field indicator',
      description: 'Set `required` to render a destructive-colored asterisk without extra markup.',
      code: `<Label htmlFor="org-name" required>Organization name</Label>
<Input id="org-name" placeholder="Acme Corp" />`,
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-2">
          <Label htmlFor="doc-org-name" required>Organization name</Label>
          <Input id="doc-org-name" placeholder="Acme Corp" />
        </div>
      ),
    },
  ],
};

export const LabelDoc = () => <PrimitiveDocView doc={LABEL_DOC} />;

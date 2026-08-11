import { Checkbox, Label } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const CHECKBOX_DOC: PrimitiveDoc = {
  overview: (
    <>
      Checkbox is a selection control built on Radix Checkbox, sharing the same error-state convention as
      Input and Textarea. Enterprise use cases include bulk-select table rows, terms-acceptance steps in
      onboarding, and multi-select filter panels.
    </>
  ),
  importStatement: "import { Checkbox, Label } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Checkbox',
      props: [
        { name: 'checked', type: 'boolean | \'indeterminate\'', description: 'Controlled checked state.' },
        { name: 'defaultChecked', type: 'boolean', description: 'Uncontrolled initial checked state.' },
        { name: 'onCheckedChange', type: '(checked: boolean | \'indeterminate\') => void', description: 'Called when the checked state changes.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the checkbox.' },
        { name: 'error', type: 'boolean | string', description: 'Marks the field as invalid and switches it to the destructive palette.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Labeled checkbox',
      code: `<div className="flex items-center gap-2">
  <Checkbox id="terms" defaultChecked />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`,
      preview: (
        <div className="flex items-center gap-2">
          <Checkbox id="doc-terms" defaultChecked />
          <Label htmlFor="doc-terms">Accept terms and conditions</Label>
        </div>
      ),
    },
    {
      title: 'Error state',
      code: `<div className="flex items-center gap-2">
  <Checkbox id="required-field" error />
  <Label htmlFor="required-field">This field is required</Label>
</div>`,
      preview: (
        <div className="flex items-center gap-2">
          <Checkbox id="doc-required-field" error />
          <Label htmlFor="doc-required-field">This field is required</Label>
        </div>
      ),
    },
  ],
};

export const CheckboxDoc = () => <PrimitiveDocView doc={CHECKBOX_DOC} />;

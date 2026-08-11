import { Label, RadioGroup, RadioGroupItem } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const RADIO_GROUP_DOC: PrimitiveDoc = {
  overview: (
    <>
      RadioGroup renders a set of mutually exclusive options built on Radix RadioGroup, with
      RadioGroupItem sharing Input and Checkbox's error-state convention. Enterprise use cases include
      plan-tier selection, single-choice survey questions, and shipping-method selection at checkout.
    </>
  ),
  importStatement: "import { RadioGroup, RadioGroupItem, Label } from '@inithium/ui';",
  propGroups: [
    {
      component: 'RadioGroup',
      props: [
        { name: 'value', type: 'string', description: 'Controlled selected value.' },
        { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial selected value.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selected value changes.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables every item in the group.' },
      ],
    },
    {
      component: 'RadioGroupItem',
      props: [
        { name: 'value', type: 'string', required: true, description: 'The value this item represents within the group.' },
        { name: 'error', type: 'boolean | string', description: 'Marks the item as invalid and switches it to the destructive palette.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Plan selection',
      code: `<RadioGroup defaultValue="pro" className="flex flex-col gap-2">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="free" id="plan-free" />
    <Label htmlFor="plan-free">Free</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="pro" id="plan-pro" />
    <Label htmlFor="plan-pro">Pro</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="enterprise" id="plan-enterprise" />
    <Label htmlFor="plan-enterprise">Enterprise</Label>
  </div>
</RadioGroup>`,
      preview: (
        <RadioGroup defaultValue="pro" className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="free" id="doc-plan-free" />
            <Label htmlFor="doc-plan-free">Free</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="pro" id="doc-plan-pro" />
            <Label htmlFor="doc-plan-pro">Pro</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="enterprise" id="doc-plan-enterprise" />
            <Label htmlFor="doc-plan-enterprise">Enterprise</Label>
          </div>
        </RadioGroup>
      ),
    },
  ],
};

export const RadioGroupDoc = () => <PrimitiveDocView doc={RADIO_GROUP_DOC} />;

import { Label, Switch } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const SWITCH_DOC: PrimitiveDoc = {
  overview: (
    <>
      Switch is a binary on/off toggle built on Radix Switch, with a themeable checked-track color.
      Enterprise use cases include feature-flag toggles in admin settings and notification-preference
      rows.
    </>
  ),
  importStatement: "import { Switch, Label } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Switch',
      props: [
        { name: 'checked', type: 'boolean', description: 'Controlled checked state.' },
        { name: 'defaultChecked', type: 'boolean', description: 'Uncontrolled initial checked state.' },
        { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the checked state changes.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the switch.' },
        { name: 'color', type: 'ColorToken', defaultValue: "'primary'", description: 'One of the 8 core theme tokens for the checked track.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Labeled switch',
      code: `<div className="flex items-center gap-2">
  <Switch id="notifications" defaultChecked />
  <Label htmlFor="notifications">Email notifications</Label>
</div>`,
      preview: (
        <div className="flex items-center gap-2">
          <Switch id="doc-notifications" defaultChecked />
          <Label htmlFor="doc-notifications">Email notifications</Label>
        </div>
      ),
    },
    {
      title: 'Themed switches',
      code: `<Switch defaultChecked color="success" />
<Switch defaultChecked color="warning" />
<Switch defaultChecked color="destructive" />
<Switch defaultChecked color="amber-200" />`,
      preview: (
        <>
          <Switch defaultChecked color="success" />
          <Switch defaultChecked color="warning" />
          <Switch defaultChecked color="destructive" />
          <Switch defaultChecked color="amber-200" />
        </>
      ),
    },
  ],
};

export const SwitchDoc = () => <PrimitiveDocView doc={SWITCH_DOC} />;

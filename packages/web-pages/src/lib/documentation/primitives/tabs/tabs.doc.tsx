import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const TABS_DOC: PrimitiveDoc = {
  overview: (
    <>
      Tabs organizes content into switchable panels sharing one visible area, built on Radix Tabs with an
      animated active-tab background. Enterprise use cases include settings pages split into General,
      Security, and Billing sections, and record detail views with Overview/Activity/Files panels.
    </>
  ),
  importStatement: "import { Tabs, TabsList, TabsTrigger, TabsContent } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Tabs',
      props: [
        { name: 'value', type: 'string', description: 'Controlled active tab value.' },
        { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial active tab value.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the active tab changes.' },
      ],
    },
    {
      component: 'TabsTrigger / TabsContent',
      props: [
        { name: 'value', type: 'string', required: true, description: 'Matches a trigger to its corresponding content panel.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Settings sections',
      code: `<Tabs defaultValue="general" className="w-full max-w-md">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="general">
    <Text size="sm" color="muted">Workspace name, timezone, and locale.</Text>
  </TabsContent>
  <TabsContent value="security">
    <Text size="sm" color="muted">SSO, session limits, and audit log retention.</Text>
  </TabsContent>
  <TabsContent value="billing">
    <Text size="sm" color="muted">Plan, seats, and payment method.</Text>
  </TabsContent>
</Tabs>`,
      preview: (
        <Tabs defaultValue="general" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Text size="sm" color="muted">Workspace name, timezone, and locale.</Text>
          </TabsContent>
          <TabsContent value="security">
            <Text size="sm" color="muted">SSO, session limits, and audit log retention.</Text>
          </TabsContent>
          <TabsContent value="billing">
            <Text size="sm" color="muted">Plan, seats, and payment method.</Text>
          </TabsContent>
        </Tabs>
      ),
    },
  ],
};

export const TabsDoc = () => <PrimitiveDocView doc={TABS_DOC} />;

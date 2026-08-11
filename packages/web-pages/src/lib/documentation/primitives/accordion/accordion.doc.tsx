import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const ACCORDION_DOC: PrimitiveDoc = {
  overview: (
    <>
      Accordion stacks multiple collapsible sections into a bordered list, in either single-open (
      <code>type=&quot;single&quot;</code>) or multi-open (<code>type=&quot;multiple&quot;</code>) mode,
      with a rotating chevron indicator. Enterprise use cases include FAQ sections and grouped settings
      panels — this documentation page's own sidebar navigation is built on Accordion.
    </>
  ),
  importStatement: "import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Accordion',
      props: [
        { name: 'type', type: "'single' | 'multiple'", required: true, description: 'Whether one or several items may be open at once.' },
        { name: 'collapsible', type: 'boolean', defaultValue: 'false', description: 'When `type="single"`, allows closing the currently open item.' },
        { name: 'value', type: 'string | string[]', description: 'Controlled open item id(s), shaped to match `type`.' },
        { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Called when the open item(s) change.' },
      ],
    },
    {
      component: 'AccordionItem',
      props: [
        { name: 'value', type: 'string', required: true, description: 'Unique identifier for this item within the accordion.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Single-open FAQ',
      code: `<Accordion type="single" collapsible className="w-full max-w-md">
  <AccordionItem value="billing">
    <AccordionTrigger>How does billing work?</AccordionTrigger>
    <AccordionContent>You're billed monthly based on active seats.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="cancel">
    <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
    <AccordionContent>Yes, cancel from account settings with no penalty.</AccordionContent>
  </AccordionItem>
</Accordion>`,
      preview: (
        <Accordion type="single" collapsible className="w-full max-w-md">
          <AccordionItem value="billing">
            <AccordionTrigger>How does billing work?</AccordionTrigger>
            <AccordionContent>You're billed monthly based on active seats.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="cancel">
            <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
            <AccordionContent>Yes, cancel from account settings with no penalty.</AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      title: 'Multiple-open settings groups',
      description: '`type="multiple"` lets more than one item stay expanded at the same time.',
      code: `<Accordion type="multiple" defaultValue={['general']} className="w-full max-w-md">
  <AccordionItem value="general">
    <AccordionTrigger>General</AccordionTrigger>
    <AccordionContent>Workspace name, timezone, and locale.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="security">
    <AccordionTrigger>Security</AccordionTrigger>
    <AccordionContent>SSO, session limits, and audit log retention.</AccordionContent>
  </AccordionItem>
</Accordion>`,
      preview: (
        <Accordion type="multiple" defaultValue={['general']} className="w-full max-w-md">
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>Workspace name, timezone, and locale.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="security">
            <AccordionTrigger>Security</AccordionTrigger>
            <AccordionContent>SSO, session limits, and audit log retention.</AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
  ],
};

export const AccordionDoc = () => <PrimitiveDocView doc={ACCORDION_DOC} />;

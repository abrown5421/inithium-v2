import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, Text } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const COLLAPSIBLE_DOC: PrimitiveDoc = {
  overview: (
    <>
      Collapsible toggles the visibility of a single block of content with an animated expand/collapse
      transition — the single-item building block that Accordion composes many of into a list. Enterprise
      use cases include "show more" detail sections, expandable filter groups, and inline advanced-options
      toggles.
    </>
  ),
  importStatement: "import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Collapsible',
      props: [
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'defaultOpen', type: 'boolean', defaultValue: 'false', description: 'Uncontrolled initial open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Prevents the trigger from toggling.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Show more details',
      code: `<Collapsible className="w-full max-w-sm">
  <CollapsibleTrigger asChild>
    <Button variant="outlined" size="sm">Toggle details</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <Text size="sm" color="muted" className="pt-2">
      Additional configuration and metadata revealed only when needed.
    </Text>
  </CollapsibleContent>
</Collapsible>`,
      preview: (
        <Collapsible className="w-full max-w-sm">
          <CollapsibleTrigger asChild>
            <Button variant="outlined" size="sm">Toggle details</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Text size="sm" color="muted" className="pt-2">
              Additional configuration and metadata revealed only when needed.
            </Text>
          </CollapsibleContent>
        </Collapsible>
      ),
    },
  ],
};

export const CollapsibleDoc = () => <PrimitiveDocView doc={COLLAPSIBLE_DOC} />;

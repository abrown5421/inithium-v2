import { Button, Popover, PopoverContent, PopoverTrigger, Text } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const POPOVER_DOC: PrimitiveDoc = {
  overview: (
    <>
      Popover displays floating, non-modal content anchored to a trigger element, built on Radix Popover
      with sensible defaults for alignment and offset. Enterprise use cases include filter builders,
      inline detail panels triggered from a table row, and quick-edit forms.
    </>
  ),
  importStatement: "import { Popover, PopoverTrigger, PopoverContent } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Popover',
      props: [
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
      ],
    },
    {
      component: 'PopoverContent',
      props: [
        { name: 'align', type: "'start' | 'center' | 'end'", defaultValue: "'center'", description: 'Alignment relative to the trigger.' },
        { name: 'sideOffset', type: 'number', defaultValue: '4', description: 'Pixel distance from the trigger.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Trigger-anchored panel',
      code: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outlined">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <Text size="sm">Anchored, non-modal content that closes on outside click.</Text>
  </PopoverContent>
</Popover>`,
      preview: (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outlined">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Text size="sm">Anchored, non-modal content that closes on outside click.</Text>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      title: 'Start-aligned',
      description: 'Use `align="start"` to left-align the panel with the trigger instead of centering it.',
      code: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outlined">Filters</Button>
  </PopoverTrigger>
  <PopoverContent align="start">
    <Text size="sm">Filter controls go here.</Text>
  </PopoverContent>
</Popover>`,
      preview: (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outlined">Filters</Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <Text size="sm">Filter controls go here.</Text>
          </PopoverContent>
        </Popover>
      ),
    },
  ],
};

export const PopoverDoc = () => <PrimitiveDocView doc={POPOVER_DOC} />;

import { ScrollArea, Separator, Text } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const LIST_ITEMS = Array.from({ length: 12 }, (_, index) => `List item ${index + 1}`);

const SCROLL_AREA_DOC: PrimitiveDoc = {
  overview: (
    <>
      ScrollArea replaces native browser scrollbars with a custom-styled, cross-browser-consistent
      scrollbar while preserving native scroll behavior, built on Radix ScrollArea. Enterprise use cases
      include sidebar navigation lists, long dropdown or menu content, and chat panes constrained to a
      fixed height — this documentation page's own sidebar and content pane both use it.
    </>
  ),
  importStatement: "import { ScrollArea } from '@inithium/ui';",
  propGroups: [
    {
      component: 'ScrollArea',
      props: [],
    },
    {
      component: 'ScrollBar',
      props: [
        { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Axis the custom scrollbar tracks.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Fixed-height list',
      description: 'ScrollArea needs an explicit height on itself or a wrapper; content beyond it scrolls with a themed thumb.',
      code: `<ScrollArea className="h-48 w-64 rounded-md border border-border p-2">
  {LIST_ITEMS.map((item) => (
    <Text key={item} size="sm" className="py-1">{item}</Text>
  ))}
</ScrollArea>`,
      preview: (
        <ScrollArea className="h-48 w-64 rounded-md border border-border p-2">
          {LIST_ITEMS.map((item, index) => (
            <div key={item}>
              <Text size="sm" className="py-1">{item}</Text>
              {index < LIST_ITEMS.length - 1 ? <Separator /> : null}
            </div>
          ))}
        </ScrollArea>
      ),
    },
  ],
};

export const ScrollAreaDoc = () => <PrimitiveDocView doc={SCROLL_AREA_DOC} />;

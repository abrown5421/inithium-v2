import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const TOOLTIP_DOC: PrimitiveDoc = {
  overview: (
    <>
      Tooltip shows a brief label on hover or focus, built on Radix Tooltip. TooltipProvider should wrap
      the application once near the root to share consistent open/close delay timing across every
      tooltip. Enterprise use cases include icon-only button labels, truncated-text disambiguation, and
      inline help affordances next to form fields.
    </>
  ),
  importStatement: "import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@inithium/ui';",
  propGroups: [
    {
      component: 'TooltipProvider',
      props: [
        { name: 'delayDuration', type: 'number', defaultValue: '700', description: 'Milliseconds a trigger must be hovered before the tooltip opens.' },
      ],
    },
    {
      component: 'TooltipContent',
      props: [
        { name: 'sideOffset', type: 'number', defaultValue: '4', description: 'Pixel distance from the trigger.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Icon button label',
      description: 'Every Tooltip must sit under a TooltipProvider ancestor, typically mounted once at the app root.',
      code: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="Settings">⚙</Button>
    </TooltipTrigger>
    <TooltipContent>Settings</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
      preview: (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Settings">⚙</Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ],
};

export const TooltipDoc = () => <PrimitiveDocView doc={TOOLTIP_DOC} />;

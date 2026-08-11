import { Skeleton } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const SKELETON_DOC: PrimitiveDoc = {
  overview: (
    <>
      Skeleton is a pulsing placeholder block used to represent content — text lines, avatars, cards —
      while real data is loading, reducing perceived latency and avoiding layout shift once the data
      arrives. Enterprise use cases include table row loading states, dashboard card skeletons, and list
      view placeholders during async data fetches.
    </>
  ),
  importStatement: "import { Skeleton } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Skeleton',
      props: [],
    },
  ],
  examples: [
    {
      title: 'Text line skeletons',
      description: 'Skeleton has no size props — dimensions are controlled entirely via `className`.',
      code: `<Skeleton className="h-4 w-48" />
<Skeleton className="h-4 w-64" />
<Skeleton className="h-4 w-40" />`,
      preview: (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      ),
    },
    {
      title: 'Avatar + text row skeleton',
      description: 'Compose Skeleton alongside a real Avatar shape to preview a loading list row.',
      code: `<div className="flex items-center gap-3">
  <Skeleton className="size-10 rounded-full" />
  <div className="flex flex-col gap-2">
    <Skeleton className="h-3 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
</div>`,
      preview: (
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ),
    },
  ],
};

export const SkeletonDoc = () => <PrimitiveDocView doc={SKELETON_DOC} />;

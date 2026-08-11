import { AspectRatio } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const ASPECT_RATIO_DOC: PrimitiveDoc = {
  overview: (
    <>
      AspectRatio constrains a child element — typically an image, video, or iframe — to a fixed
      width-to-height ratio regardless of container width, preventing layout shift while content loads.
      Enterprise use cases include thumbnail grids in an asset picker, embedded video in a content editor,
      and responsive hero banners.
    </>
  ),
  importStatement: "import { AspectRatio } from '@inithium/ui';",
  propGroups: [
    {
      component: 'AspectRatio',
      props: [
        { name: 'ratio', type: 'number', defaultValue: '1', description: 'Width ÷ height ratio the child is constrained to, e.g. 16 / 9.' },
      ],
    },
  ],
  examples: [
    {
      title: '16:9 media container',
      description: 'Used to reserve space for a video embed or hero image before it finishes loading.',
      code: `<AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
  <video src="/hero.mp4" className="size-full object-cover" />
</AspectRatio>`,
      preview: (
        <AspectRatio ratio={16 / 9} className="w-64 overflow-hidden rounded-lg bg-muted">
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            16 / 9
          </div>
        </AspectRatio>
      ),
    },
    {
      title: 'Square 1:1 thumbnail',
      description: 'A common ratio for asset-picker grids and avatar-style previews.',
      code: `<AspectRatio ratio={1} className="w-24 overflow-hidden rounded-lg bg-muted">
  <img src="/thumb.jpg" className="size-full object-cover" alt="Asset thumbnail" />
</AspectRatio>`,
      preview: (
        <AspectRatio ratio={1} className="w-24 overflow-hidden rounded-lg bg-muted">
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            1 / 1
          </div>
        </AspectRatio>
      ),
    },
  ],
};

export const AspectRatioDoc = () => <PrimitiveDocView doc={ASPECT_RATIO_DOC} />;

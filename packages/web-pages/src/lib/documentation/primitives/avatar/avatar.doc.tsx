import { Avatar, AvatarFallback, AvatarImage } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const AVATAR_DOC: PrimitiveDoc = {
  overview: (
    <>
      Avatar renders a circular image with an automatic text or icon fallback for missing or slow-loading
      images, composed from three parts — Avatar, AvatarImage, and AvatarFallback — around Radix's Avatar
      primitive. Enterprise use cases include user pickers, comment threads, and org member lists where
      avatar images frequently 404 or are still loading.
    </>
  ),
  importStatement: "import { Avatar, AvatarImage, AvatarFallback } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Avatar',
      props: [],
    },
    {
      component: 'AvatarImage',
      props: [
        { name: 'src', type: 'string', description: 'Image source URL.' },
        { name: 'alt', type: 'string', description: 'Accessible alternative text for the image.' },
      ],
    },
    {
      component: 'AvatarFallback',
      props: [
        { name: 'delayMs', type: 'number', description: 'Delay before rendering the fallback, useful to avoid a flash when the image loads quickly.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Image avatar with fallback',
      description: 'AvatarFallback renders automatically whenever AvatarImage fails to load or is still loading.',
      code: `<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="Jordan Lee" />
  <AvatarFallback>JL</AvatarFallback>
</Avatar>`,
      preview: (
        <Avatar>
          <AvatarImage src="https://broken-image-url.example/avatar.jpg" alt="Jordan Lee" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
      ),
    },
    {
      title: 'Initials-only, sized with className',
      description: 'Avatar has no `size` prop — control diameter with Tailwind size utilities on `className`.',
      code: `<Avatar className="size-8">
  <AvatarFallback>AB</AvatarFallback>
</Avatar>
<Avatar className="size-12">
  <AvatarFallback>CD</AvatarFallback>
</Avatar>
<Avatar className="size-16">
  <AvatarFallback>EF</AvatarFallback>
</Avatar>`,
      preview: (
        <>
          <Avatar className="size-8">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar className="size-12">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar className="size-16">
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
        </>
      ),
    },
  ],
};

export const AvatarDoc = () => <PrimitiveDocView doc={AVATAR_DOC} />;

import { Progress } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const PROGRESS_DOC: PrimitiveDoc = {
  overview: (
    <>
      Progress renders a determinate horizontal bar with a spring-animated fill, built on Radix Progress
      with a themeable indicator color. Enterprise use cases include file-upload progress, multi-step
      onboarding progress, and background job completion status.
    </>
  ),
  importStatement: "import { Progress } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Progress',
      props: [
        { name: 'value', type: 'number', description: 'Completion percentage from 0–100.' },
        { name: 'color', type: 'ColorToken', defaultValue: "'primary'", description: 'One of the 8 core theme tokens for the filled indicator.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Upload progress',
      code: `<Progress value={64} className="max-w-sm" />`,
      preview: <Progress value={64} className="max-w-sm" />,
    },
    {
      title: 'Themed progress states',
      code: `<Progress value={100} color="success" className="max-w-sm" />
<Progress value={45} color="warning" className="max-w-sm" />
<Progress value={20} color="destructive" className="max-w-sm" />`,
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Progress value={100} color="success" />
          <Progress value={45} color="warning" />
          <Progress value={20} color="destructive" />
        </div>
      ),
    },
  ],
};

export const ProgressDoc = () => <PrimitiveDocView doc={PROGRESS_DOC} />;

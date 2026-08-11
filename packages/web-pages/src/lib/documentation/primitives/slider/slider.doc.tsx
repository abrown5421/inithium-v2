import { Slider } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const SLIDER_DOC: PrimitiveDoc = {
  overview: (
    <>
      Slider is a draggable range control built on Radix Slider, supporting single or multi-thumb
      (range) selection and a themeable filled-track color. Enterprise use cases include numeric filter
      ranges, budget or threshold configuration, and volume-style settings.
    </>
  ),
  importStatement: "import { Slider } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Slider',
      props: [
        { name: 'value', type: 'number[]', description: 'Controlled thumb value(s).' },
        { name: 'defaultValue', type: 'number[]', description: 'Uncontrolled initial thumb value(s); array length determines thumb count.' },
        { name: 'min', type: 'number', defaultValue: '0', description: 'Minimum value.' },
        { name: 'max', type: 'number', defaultValue: '100', description: 'Maximum value.' },
        { name: 'step', type: 'number', defaultValue: '1', description: 'Increment between selectable values.' },
        { name: 'onValueChange', type: '(value: number[]) => void', description: 'Called while a thumb is dragged.' },
        { name: 'color', type: 'ColorToken', defaultValue: "'primary'", description: 'One of the 8 core theme tokens for the filled track and thumb border.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Single-value slider',
      code: `<Slider defaultValue={[40]} className="max-w-sm" />`,
      preview: (
        <Slider defaultValue={[40]} className="max-w-sm" />
      ),
    },
    {
      title: 'Themed range slider',
      description: 'Passing two values in `defaultValue` renders two draggable thumbs for a min/max range.',
      code: `<Slider defaultValue={[20, 80]} color="success" className="max-w-sm" />
<Slider defaultValue={[20, 80]} color="indigo-500" className="max-w-sm" />
      `,
      preview: (
        <>
          <Slider defaultValue={[20, 80]} color="success" className="max-w-sm" />
          <Slider defaultValue={[20, 80]} color="indigo-500" className="max-w-sm" />
        </>
      ),
    },
  ],
};

export const SliderDoc = () => <PrimitiveDocView doc={SLIDER_DOC} />;

import { Spinner } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const SPINNER_DOC: PrimitiveDoc = {
  overview: (
    <>
      Spinner is an accessible loading indicator — a rotating icon paired with a visually hidden status
      label — used standalone or automatically swapped in by Button's <code>loading</code> prop.
      Enterprise use cases include async data-fetch placeholders and inline loading states next to a
      disabled action.
    </>
  ),
  importStatement: "import { Spinner } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Spinner',
      props: [
        { name: 'size', type: "'sm' | 'default' | 'lg'", defaultValue: "'default'", description: 'Diameter of the spinner.' },
        { name: 'label', type: 'string', defaultValue: "'Loading'", description: 'Accessible label announced to assistive tech while visible.' },
        { name: 'color', type: 'ColorToken', defaultValue: "'muted'", description: 'One of the 8 core theme tokens, or a literal Tailwind shade.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Sizes',
      code: `<Spinner size="sm" />
<Spinner size="default" />
<Spinner size="lg" />`,
      preview: (
        <>
          <Spinner size="sm" />
          <Spinner size="default" />
          <Spinner size="lg" />
        </>
      ),
    },
    {
      title: 'Themed spinners',
      code: `<Spinner color="primary" label="Loading dashboard" />
<Spinner color="success" label="Syncing" />
<Spinner color="yellow-600" label="Syncing" />`,
      preview: (
        <>
          <Spinner color="primary" label="Loading dashboard" />
          <Spinner color="success" label="Syncing" />
          <Spinner color="yellow-600" label="Syncing" />
        </>
      ),
    },
  ],
};

export const SpinnerDoc = () => <PrimitiveDocView doc={SPINNER_DOC} />;

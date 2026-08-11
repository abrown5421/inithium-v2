import { Heading } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const HEADING_DOC: PrimitiveDoc = {
  overview: (
    <>
      Heading renders a semantic <code>h1</code>–<code>h6</code> element while decoupling document
      structure from visual scale — a page can render an <code>h2</code> that reads like a hero title, or
      vice versa, without breaking heading order for assistive tech. Enterprise use cases include
      dashboard section headers, empty-state titles, and modal titles that need a specific visual weight
      regardless of how deep they sit in the page outline.
    </>
  ),
  importStatement: "import { Heading } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Heading',
      props: [
        { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', defaultValue: '2', description: 'Sets both the rendered <h{level}> tag and its visual scale.' },
        { name: 'font', type: "'primary' | 'secondary' | 'sans' | 'serif' | 'mono'", defaultValue: "'sans'", description: 'Font-family variant.' },
        { name: 'color', type: 'ColorToken', description: 'One of the 8 core theme tokens. Omit for the default text-foreground treatment.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Merges heading styling onto its immediate child instead of rendering an h-tag.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Visual scale, levels 1–6',
      description: 'The rendered tag always tracks `level`, keeping heading order intact for screen readers.',
      code: `<Heading level={1}>Level 1</Heading>
<Heading level={2}>Level 2</Heading>
<Heading level={3}>Level 3</Heading>
<Heading level={4}>Level 4</Heading>`,
      preview: (
        <div className="flex flex-col gap-1">
          <Heading level={1}>Level 1</Heading>
          <Heading level={2}>Level 2</Heading>
          <Heading level={3}>Level 3</Heading>
          <Heading level={4}>Level 4</Heading>
        </div>
      ),
    },
    {
      title: 'Themed & alternate fonts',
      description: 'Combine `font` and `color` to differentiate a hero title from a muted section label.',
      code: `<Heading level={2} font="secondary" color="primary">Quarterly revenue</Heading>
<Heading level={5} font="serif" color="muted">Last updated 2 minutes ago</Heading>
<Heading level={5} font="serif" color="indigo-300">This heading is indigo 300</Heading>`,
      preview: (
        <div className="flex flex-col gap-1">
          <Heading level={2} font="secondary" color="primary">Quarterly revenue</Heading>
          <Heading level={5} font="serif" color="muted">Last updated 2 minutes ago</Heading>
          <Heading level={5} font="serif" color="indigo-300">This heading is indigo 300</Heading>
        </div>
      ),
    },
  ],
};

export const HeadingDoc = () => <PrimitiveDocView doc={HEADING_DOC} />;

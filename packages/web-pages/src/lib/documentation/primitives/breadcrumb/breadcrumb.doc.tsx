import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const BREADCRUMB_DOC: PrimitiveDoc = {
  overview: (
    <>
      Breadcrumb renders a hierarchical trail of links back to parent pages, with a current-page marker
      and an optional ellipsis for collapsing long paths. Enterprise use cases include nested resource
      navigation such as Org &rsaquo; Project &rsaquo; Settings, and file or folder path display.
    </>
  ),
  importStatement: "import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@inithium/ui';",
  propGroups: [
    {
      component: 'BreadcrumbLink',
      props: [
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Merges link behavior onto its immediate child, e.g. a router Link.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Nested resource path',
      code: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/org">Acme Corp</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/org/projects">Projects</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Settings</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
      preview: (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Acme Corp</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ),
    },
  ],
};

export const BreadcrumbDoc = () => <PrimitiveDocView doc={BREADCRUMB_DOC} />;

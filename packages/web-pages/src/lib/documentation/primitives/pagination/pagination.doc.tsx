import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const PAGINATION_DOC: PrimitiveDoc = {
  overview: (
    <>
      Pagination is a set of link-based page-navigation primitives — Previous/Next controls, numbered
      links with an active state, and an ellipsis for collapsing long ranges. Enterprise use cases
      include paged data tables, search results, and admin list views.
    </>
  ),
  importStatement: "import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@inithium/ui';",
  propGroups: [
    {
      component: 'PaginationLink',
      props: [
        { name: 'isActive', type: 'boolean', defaultValue: 'false', description: 'Highlights this link as the current page.' },
        { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", defaultValue: "'icon'", description: 'Button size passed through to the underlying link styling.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Numbered page range',
      code: `<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`,
      preview: (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ),
    },
  ],
};

export const PaginationDoc = () => <PrimitiveDocView doc={PAGINATION_DOC} />;

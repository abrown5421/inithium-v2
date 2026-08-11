import * as React from 'react';
import { PaginationControl } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

const PaginationControlDemo = () => {
  const [page, setPage] = React.useState(1);

  return <PaginationControl currentPage={page} totalPages={20} maxVisiblePages={7} onPageChange={setPage} />;
};

const PAGINATION_DOC: CompositeDoc = {
  overview: (
    <>
      This is the PaginationControl composite — a fully-assembled, controlled, button-driven pager with
      previous/next arrows and a number button per page. It's distinct from the link-based Pagination
      primitives documented under Primitives (Pagination, PaginationLink, PaginationEllipsis, etc.),
      which are unstyled building blocks for assembling a custom `{'<a href>'}`-based pager; this
      composite is the ready-to-use control DataTable, AssetPicker, and UserPicker all mount internally.
      With no maxVisiblePages it renders one button per page; passing it truncates long ranges into a
      "1 … 8 9 10 … 20" layout. It holds no page state of its own — it only reports clicks via
      onPageChange.
    </>
  ),
  importStatement: "import { PaginationControl } from '@inithium/ui';",
  composition: [
    { name: 'Button', role: 'Previous/next arrows and every page number, switching between outlined (current page) and ghost (others).' },
    { name: 'PaginationEllipsis', role: 'The primitive ellipsis marker, reused here once truncation kicks in.' },
    { name: 'getPaginationRange', role: 'Pure utility computing which page numbers/ellipses to render for the current page, sibling count, and boundary count.' },
  ],
  propGroups: [
    {
      component: 'PaginationControl',
      props: [
        { name: 'currentPage', type: 'number', required: true, description: 'Current 1-indexed page. Fully controlled.' },
        { name: 'totalPages', type: 'number', required: true, description: 'Total page count.' },
        { name: 'onPageChange', type: '(page: number) => void', required: true, description: 'Fires with the next 1-indexed page.' },
        { name: 'siblingCount', type: 'number', defaultValue: '1', description: 'Page buttons shown on either side of the current page once truncated.' },
        { name: 'boundaryCount', type: 'number', defaultValue: '1', description: 'Page buttons always shown at the start/end once truncated.' },
        { name: 'maxVisiblePages', type: 'number', description: 'Truncates with an ellipsis once totalPages exceeds this. Unset renders every page.' },
        { name: 'showPrevNext', type: 'boolean', defaultValue: 'true', description: 'Hides the previous/next arrow buttons.' },
        { name: 'size', type: "ButtonProps['size']", defaultValue: "'icon'", description: 'Button size for every arrow/number button.' },
        { name: 'renderPageLabel', type: '(page: number) => React.ReactNode', description: 'Customizes what renders inside each page button. Defaults to the page number.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Truncated long range',
      description: 'totalPages=20 with maxVisiblePages=7 collapses the middle of the range into an ellipsis as you page through it.',
      code: `const [page, setPage] = useState(1);

<PaginationControl currentPage={page} totalPages={20} maxVisiblePages={7} onPageChange={setPage} />`,
      preview: <PaginationControlDemo />,
    },
  ],
};

export const PaginationDoc = () => <CompositeDocView doc={PAGINATION_DOC} />;

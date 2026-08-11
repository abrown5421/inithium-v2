import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const TABLE_DOC: PrimitiveDoc = {
  overview: (
    <>
      Table is a lightly styled set of native table primitives, wrapped in a horizontal-scroll container,
      with hover and <code>data-state=&quot;selected&quot;</code> row treatments built in. Enterprise use
      cases include lists of records — users, orders, invoices — before layering on sorting, filtering, or
      pagination via a composite like DataTable.
    </>
  ),
  importStatement: "import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Table and its slots',
      props: [],
    },
  ],
  examples: [
    {
      title: 'Records table',
      code: `<Table>
  <TableCaption>Recent invoices</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV-001</TableCell>
      <TableCell><Badge color="success">Paid</Badge></TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>INV-002</TableCell>
      <TableCell><Badge color="warning">Pending</Badge></TableCell>
      <TableCell>$150.00</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={2}>Total</TableCell>
      <TableCell>$400.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>`,
      preview: (
        <Table>
          <TableCaption>Recent invoices</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV-001</TableCell>
              <TableCell><Badge color="success">Paid</Badge></TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV-002</TableCell>
              <TableCell><Badge color="warning">Pending</Badge></TableCell>
              <TableCell>$150.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell>$400.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ),
    },
  ],
};

export const TableDoc = () => <PrimitiveDocView doc={TABLE_DOC} />;

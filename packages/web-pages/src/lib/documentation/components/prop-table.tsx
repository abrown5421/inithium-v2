import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@inithium/ui';
import type { PropDoc } from '../documentation-page.types.js';

export interface PropTableProps {
  readonly props: readonly PropDoc[];
}

export const PropTable = ({ props }: PropTableProps) => {
  if (props.length === 0) {
    return (
      <Text size="sm" color="muted">
        This entry documents a composition pattern rather than a component with its own props.
      </Text>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell>
                <Text as="span" font="mono" size="sm" weight="medium">
                  {prop.name}
                  {prop.required ? <Text as="span" color="destructive">{' *'}</Text> : null}
                </Text>
              </TableCell>
              <TableCell>
                <Text as="span" font="mono" size="xs" color="muted">
                  {prop.type}
                </Text>
              </TableCell>
              <TableCell>
                <Text as="span" font="mono" size="xs" color="muted">
                  {prop.defaultValue ?? '—'}
                </Text>
              </TableCell>
              <TableCell>
                <Text as="span" size="sm">
                  {prop.description}
                </Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

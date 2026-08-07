import { Card, CardContent, CardHeader, CardTitle, Text } from '@inithium/ui';
import { CodeBlock } from './code-block.js';
import { PropTable } from './prop-table.js';
import type { ComponentDoc } from '../documentation-page.types.js';

export interface ComponentDocCardProps {
  readonly doc: ComponentDoc;
}

export const ComponentDocCard = ({ doc }: ComponentDocCardProps) => (
  <Card id={doc.id} className="scroll-mt-24">
    <CardHeader>
      <CardTitle>
        <Text as="span" size="lg" weight="semibold">
          {doc.name}
        </Text>
      </CardTitle>
      <Text size="sm" color="muted">
        {doc.summary}
      </Text>
    </CardHeader>
    <CardContent className="flex flex-col gap-6">
      {doc.notes ? (
        <div className="rounded-md border border-info/30 bg-info/10 px-3 py-2">
          <Text size="xs" color="info">
            {doc.notes}
          </Text>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Text as="span" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
          Preview
        </Text>
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-border p-6">
          {doc.preview}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Text as="span" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
          Import
        </Text>
        <CodeBlock code={doc.importStatement} language="ts" />
      </div>

      <div className="flex flex-col gap-2">
        <Text as="span" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
          Usage
        </Text>
        <CodeBlock code={doc.usageCode} />
      </div>

      <div className="flex flex-col gap-2">
        <Text as="span" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
          Props
        </Text>
        <PropTable props={doc.props} />
      </div>
    </CardContent>
  </Card>
);

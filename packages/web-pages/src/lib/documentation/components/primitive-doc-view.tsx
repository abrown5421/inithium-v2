import { Heading, Separator, Text } from '@inithium/ui';
import { CodeBlock } from './code-block.js';
import { PropTable } from './prop-table.js';
import type { PrimitiveDoc } from '../primitives/primitive-doc.types.js';

export interface PrimitiveDocViewProps {
  readonly doc: PrimitiveDoc;
}

export const PrimitiveDocView = ({ doc }: PrimitiveDocViewProps) => (
  <div className="flex flex-col gap-8">
    <Text size="sm" color="muted" className="max-w-3xl">
      {doc.overview}
    </Text>

    <div className="flex flex-col gap-2">
      <Text as="span" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
        Import
      </Text>
      <CodeBlock code={doc.importStatement} language="ts" />
    </div>

    <Separator />

    <div className="flex flex-col gap-4">
      <Heading level={4}>Props API</Heading>
      {doc.propGroups.map((group) => (
        <div key={group.component} className="flex flex-col gap-2">
          {doc.propGroups.length > 1 ? (
            <Text as="span" font="mono" size="sm" weight="medium">
              {group.component}
            </Text>
          ) : null}
          <PropTable props={group.props} />
        </div>
      ))}
    </div>

    <Separator />

    <div className="flex flex-col gap-6">
      <Heading level={4}>Usage &amp; Theming Examples</Heading>
      {doc.examples.map((example) => (
        <div key={example.title} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Text as="span" size="sm" weight="medium">
              {example.title}
            </Text>
            {example.description ? (
              <Text size="sm" color="muted">
                {example.description}
              </Text>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-border p-6">
            {example.preview}
          </div>
          <CodeBlock code={example.code} />
        </div>
      ))}
    </div>
  </div>
);

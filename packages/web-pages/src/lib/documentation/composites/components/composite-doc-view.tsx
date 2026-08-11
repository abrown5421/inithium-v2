import { Heading, Separator, Text } from '@inithium/ui';
import { CodeBlock } from '../../components/code-block.js';
import { PropTable } from '../../components/prop-table.js';
import type { CompositeDoc } from '../composite-doc.types.js';

export interface CompositeDocViewProps {
  readonly doc: CompositeDoc;
}

export const CompositeDocView = ({ doc }: CompositeDocViewProps) => (
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

    <div className="flex flex-col gap-3">
      <Heading level={4}>Composition Breakdown</Heading>
      <div className="rounded-lg border border-border">
        <ul className="divide-y divide-border">
          {doc.composition.map((entry) => (
            <li key={entry.name} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-3">
              <Text as="span" font="mono" size="sm" weight="medium" className="sm:w-52 sm:shrink-0">
                {entry.name}
              </Text>
              <Text size="sm" color="muted">
                {entry.role}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <Separator />

    <div className="flex flex-col gap-4">
      <Heading level={4}>Props API &amp; Config</Heading>
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
      <Heading level={4}>Live Preview &amp; Usage Examples</Heading>
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

import { Text } from '@inithium/ui';
import { ComponentDocCard } from './component-doc-card.js';
import type { DocumentationSection } from '../documentation-page.types.js';

export interface SectionPanelProps {
  readonly section: DocumentationSection;
}

export const SectionPanel = ({ section }: SectionPanelProps) => (
  <div className="flex flex-col gap-6">
    <Text size="sm" color="muted" className="max-w-3xl">
      {section.description}
    </Text>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {section.components.map((doc) => (
        <ComponentDocCard key={doc.id} doc={doc} />
      ))}
    </div>
  </div>
);

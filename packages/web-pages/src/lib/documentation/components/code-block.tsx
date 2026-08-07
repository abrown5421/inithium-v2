import { Text } from '@inithium/ui';

export interface CodeBlockProps {
  readonly code: string;
  readonly language?: string;
}

export const CodeBlock = ({ code, language = 'tsx' }: CodeBlockProps) => (
  <div className="overflow-hidden rounded-lg border border-border bg-muted/40">
    <div className="flex items-center justify-between border-b border-border px-4 py-1.5">
      <Text as="span" size="xs" weight="medium" color="muted" className="uppercase tracking-wide">
        {language}
      </Text>
    </div>
    <div className="overflow-x-auto px-4 py-3">
      <Text as="div" font="mono" size="sm" className="whitespace-pre">
        {code.trim()}
      </Text>
    </div>
  </div>
);

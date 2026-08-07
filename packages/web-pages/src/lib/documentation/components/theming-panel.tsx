import { Card, CardContent, CardHeader, CardTitle, Text } from '@inithium/ui';
import { CodeBlock } from './code-block.js';
import { THEME_COLOR_TOKENS, THEME_CONCEPTS, THEME_HOOKS, THEME_TOKEN_PREVIEW } from '../data/theming.data.js';

export const ThemingPanel = () => (
  <div className="flex flex-col gap-6">
    <Text size="sm" color="muted" className="max-w-3xl">
      Theming in @inithium/ui is token-driven rather than provider-driven: components read a color prop
      constrained to 8 core tokens, and runtime overrides are applied by writing CSS custom properties —
      there is no ThemeProvider to wrap the tree in.
    </Text>

    <Card>
      <CardHeader>
        <CardTitle>Core color tokens</CardTitle>
        <Text size="sm" color="muted">
          {THEME_COLOR_TOKENS.length} tokens, each backed by a CSS custom property and rendered live below
          via Badge and Button&apos;s color prop.
        </Text>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border border-dashed border-border p-6">{THEME_TOKEN_PREVIEW}</div>
        <CodeBlock
          language="ts"
          code={`CORE_COLOR_TOKENS = [\n  ${THEME_COLOR_TOKENS.map((doc) => `'${doc.token}'`).join(',\n  ')}\n] as const;`}
        />
      </CardContent>
    </Card>

    <div>
      <Text as="span" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
        Hooks &amp; utilities
      </Text>
      <div className="mt-3 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {THEME_HOOKS.map((hook) => (
          <Card key={hook.id}>
            <CardHeader>
              <CardTitle>
                <Text as="span" font="mono" size="base" weight="semibold">
                  {hook.name}
                </Text>
              </CardTitle>
              <Text size="sm" color="muted">
                {hook.description}
              </Text>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <CodeBlock language="ts" code={hook.signature} />
              <CodeBlock code={hook.usageCode} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    <div>
      <Text as="span" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
        Concepts
      </Text>
      <div className="mt-3 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {THEME_CONCEPTS.map((concept) => (
          <Card key={concept.id}>
            <CardHeader>
              <CardTitle>{concept.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Text size="sm">{concept.description}</Text>
              {concept.usageCode ? <CodeBlock code={concept.usageCode} /> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

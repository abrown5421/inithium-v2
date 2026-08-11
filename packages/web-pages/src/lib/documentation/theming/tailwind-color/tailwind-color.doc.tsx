import { Badge, Button, Progress, Slider, Text, TAILWIND_COLOR_FAMILIES, TAILWIND_COLOR_SHADES } from '@inithium/ui';
import { CodeBlock } from '../../components/code-block.js';
import { ColorSwatchGrid } from '../components/color-swatch-grid.js';
import { ThemingDocSection } from '../components/theming-doc-section.js';

const FAMILY_SWATCHES = TAILWIND_COLOR_FAMILIES.map((family) => ({
  label: family,
  swatchClassName: `bg-${family}-500`,
  meta: `${family}-500`,
}));

const BLUE_SHADE_SWATCHES = TAILWIND_COLOR_SHADES.map((shade) => ({
  label: `blue-${shade}`,
  swatchClassName: `bg-blue-${shade}`,
  meta: `bg-blue-${shade}`,
}));

export const TailwindColorDoc = () => (
  <div className="flex flex-col gap-10">
    <ThemingDocSection
      title="Beyond the 8 Core Tokens"
      description="Every prop typed as ColorToken accepts a core semantic token or a literal Tailwind palette shade, e.g. 'emerald-500'. This covers one-off accent colors — a single chart series, a brand-specific badge — without adding a 9th semantic token that would need to be threaded through every theme."
    >
      <CodeBlock
        language="ts"
        code={`type ColorToken = CoreColorToken | TailwindColorValue;
// TailwindColorValue = \`\${TailwindColorFamilyName}-\${TailwindColorShade}\`

<Badge color="emerald-500">Shipped</Badge>
<Button variant="solid" color="red-700">Force delete</Button>`}
      />
    </ThemingDocSection>

    <ThemingDocSection
      title="Family & Shade Matrix"
      description={`${TAILWIND_COLOR_FAMILIES.length} Tailwind v4 default families × ${TAILWIND_COLOR_SHADES.length} shades each (${TAILWIND_COLOR_SHADES[0]}–${TAILWIND_COLOR_SHADES[TAILWIND_COLOR_SHADES.length - 1]}, no 50) = ${TAILWIND_COLOR_FAMILIES.length * TAILWIND_COLOR_SHADES.length} valid ColorToken values. Every combination resolves through the same 11 recipes as the core tokens — resolveColorRecipeClassName dispatches to whichever resolver matches the value it's given.`}
    >
      <ColorSwatchGrid swatches={FAMILY_SWATCHES} />
      <div className="flex flex-col gap-3">
        <Text as="span" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
          Full shade range, one family (blue)
        </Text>
        <ColorSwatchGrid swatches={BLUE_SHADE_SWATCHES} />
      </div>
    </ThemingDocSection>

    <ThemingDocSection title="Usage & Theming Examples">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="solid" color="indigo-600">Indigo action</Button>
        <Badge color="rose-500">rose-500</Badge>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Progress value={72} color="teal-500" />
        <Slider defaultValue={[20, 80]} color="amber-500" />
      </div>
      <CodeBlock
        code={`<Button variant="solid" color="indigo-600">Indigo action</Button>
<Badge color="rose-500">rose-500</Badge>
<Progress value={72} color="teal-500" />
<Slider defaultValue={[20, 80]} color="amber-500" />`}
      />
    </ThemingDocSection>
  </div>
);

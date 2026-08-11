import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  CORE_COLOR_TOKENS,
  CORE_COLOR_TOKEN_LABELS,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@inithium/ui';
import { CodeBlock } from '../../components/code-block.js';
import { ColorSwatchGrid } from '../components/color-swatch-grid.js';
import { ThemingDocSection } from '../components/theming-doc-section.js';

const CORE_TOKEN_SWATCHES = CORE_COLOR_TOKENS.map((token) => ({
  label: CORE_COLOR_TOKEN_LABELS[token],
  swatchClassName: `bg-${token}`,
  meta: `--${token}`,
}));

const RECIPE_ROWS: readonly { recipe: string; description: string; usedBy: string }[] = [
  { recipe: 'solid', description: 'Filled background with high-contrast foreground text.', usedBy: 'Button, Badge' },
  { recipe: 'outlined', description: 'Colored border and text with a soft-tint hover fill.', usedBy: 'Button, Badge' },
  { recipe: 'ghost', description: 'Colored text with a soft-tint hover fill, no border.', usedBy: 'Button' },
  { recipe: 'link', description: 'Colored text, underlines on hover.', usedBy: 'Button' },
  { recipe: 'soft', description: 'Translucent tinted background, border, and icon color.', usedBy: 'Alert' },
  { recipe: 'toast', description: 'Background color-mixed with the popover surface, tinted border.', usedBy: 'AlertToast (fixed to destructive/success/warning/info)' },
  { recipe: 'plain', description: 'Text color only, no background or border.', usedBy: 'Heading, Text, Spinner' },
  { recipe: 'fill', description: 'Solid background only, for a filled indicator shape.', usedBy: 'Progress indicator, Slider range' },
  { recipe: 'border', description: 'Border color only.', usedBy: 'Slider thumb' },
  { recipe: 'checked', description: 'Background applied only in the checked data-state.', usedBy: 'Switch' },
  { recipe: 'field', description: 'Focus border/ring plus text-selection colors for form fields.', usedBy: 'Input, Select, Combobox trigger' },
];

export const ThemeColorDoc = () => (
  <div className="flex flex-col gap-10">
    <ThemingDocSection
      title="Semantic Theme Palette"
      description="Every colorable primitive in @inithium/ui accepts a color prop constrained to 8 core semantic tokens. Each token is a CSS custom property defined in globals.css's :root/.dark blocks, so switching themes never requires touching component code — only the variable values change."
    >
      <ColorSwatchGrid swatches={CORE_TOKEN_SWATCHES} />
      <CodeBlock
        language="ts"
        code={`CORE_COLOR_TOKENS = [\n  ${CORE_COLOR_TOKENS.map((token) => `'${token}'`).join(',\n  ')}\n] as const;`}
      />
    </ThemingDocSection>

    <ThemingDocSection
      title="Structural Recipes"
      description="A token alone isn't enough to produce a class string — 'primary' means something different on a solid Button than on an outlined Badge. resolveColorRecipeClassName(recipe, color) pairs a structural treatment with a token to produce the complete Tailwind class string a component renders."
    >
      <CodeBlock
        code={`import { resolveColorRecipeClassName } from '@inithium/ui';

resolveColorRecipeClassName('solid', 'success');
// -> 'bg-success text-success-foreground hover:bg-success/90'`}
      />
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipe</TableHead>
              <TableHead>Produces</TableHead>
              <TableHead>Used by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RECIPE_ROWS.map((row) => (
              <TableRow key={row.recipe}>
                <TableCell className="font-mono text-sm">{row.recipe}</TableCell>
                <TableCell className="text-sm">{row.description}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.usedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ThemingDocSection>

    <ThemingDocSection
      title="Runtime Overrides via the site.theme Setting"
      description="The 8 tokens can be overridden at runtime without a rebuild. Both apps/web and apps/cms read the site.theme Setting on load and apply it with useApplyCoreThemeColors, which writes matching --{token} custom properties directly onto the document root — partial values are supported, so an incomplete override never blanks out the rest of the palette."
    >
      <CodeBlock
        code={`const { data: settingsData } = useReadAllSettingsQuery();
const settingsMap = extractSettingsMap(settingsData);
const themeColors = parseCoreThemeColors(settingsMap['site.theme']);
useApplyCoreThemeColors(themeColors);`}
      />
    </ThemingDocSection>

    <ThemingDocSection title="Usage Patterns">
      <div className="flex flex-wrap items-center gap-3">
        <Button color="primary">Primary action</Button>
        <Badge color="success">Live</Badge>
        <Badge variant="outlined" color="warning">Draft</Badge>
      </div>
      <Alert color="info" className="max-w-md">
        <AlertTitle>Themed alert</AlertTitle>
        <AlertDescription>Alert uses the 'soft' recipe to tint its border, background, and icon together.</AlertDescription>
      </Alert>
      <CodeBlock
        code={`<Button color="primary">Primary action</Button>
<Badge color="success">Live</Badge>
<Badge variant="outlined" color="warning">Draft</Badge>

<Alert color="info">
  <AlertTitle>Themed alert</AlertTitle>
  <AlertDescription>
    Alert uses the 'soft' recipe to tint its border, background, and icon together.
  </AlertDescription>
</Alert>`}
      />
    </ThemingDocSection>
  </div>
);

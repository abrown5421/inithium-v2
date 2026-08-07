import { Badge, Button, CORE_COLOR_TOKENS, CORE_COLOR_TOKEN_LABELS } from '@inithium/ui';
import type { ThemeConceptDoc, ThemeHookDoc, ThemeTokenDoc } from '../documentation-page.types.js';

export const THEME_COLOR_TOKENS: readonly ThemeTokenDoc[] = CORE_COLOR_TOKENS.map((token) => ({
  token,
  label: CORE_COLOR_TOKEN_LABELS[token],
  cssVariable: `--${token}`,
}));

export const THEME_TOKEN_PREVIEW = (
  <div className="flex w-full flex-wrap gap-4">
    {CORE_COLOR_TOKENS.map((token) => (
      <div key={token} className="flex flex-col items-start gap-2">
        <Badge color={token}>{CORE_COLOR_TOKEN_LABELS[token]}</Badge>
        <Button size="sm" variant="outlined" color={token}>
          {token}
        </Button>
      </div>
    ))}
  </div>
);

export const THEME_HOOKS: readonly ThemeHookDoc[] = [
  {
    id: 'use-apply-core-theme-colors',
    name: 'useApplyCoreThemeColors',
    signature: 'useApplyCoreThemeColors(colors: CoreThemeColorValues | undefined): void',
    description:
      'The closest thing to a "useTheme" hook in @inithium/ui — a useEffect wrapper that writes token overrides onto document.documentElement as CSS custom properties whenever colors changes.',
    usageCode: `import { parseCoreThemeColors, useApplyCoreThemeColors } from '@inithium/ui';

const themeColors = React.useMemo(
  () => parseCoreThemeColors(settingsMap['site.theme']),
  [settingsMap],
);
useApplyCoreThemeColors(themeColors);`,
  },
  {
    id: 'apply-core-theme-colors',
    name: 'applyCoreThemeColors',
    signature: 'applyCoreThemeColors(colors: CoreThemeColorValues, target?: HTMLElement): void',
    description:
      'The imperative function useApplyCoreThemeColors wraps. Only writes tokens present in colors, so a partial value never blanks out the rest of the palette.',
    usageCode: `applyCoreThemeColors({ primary: 'oklch(0.65 0.2 280)' });
// Later, targeting a scoped subtree instead of the document root:
applyCoreThemeColors({ accent: '#f97316' }, previewContainerRef.current);`,
  },
  {
    id: 'parse-core-theme-colors',
    name: 'parseCoreThemeColors',
    signature: 'parseCoreThemeColors(value: unknown): CoreThemeColorValues',
    description:
      'Narrows an arbitrary settings blob (e.g. a JSON column from the CMS) down to the 8 known token keys with string values, dropping anything else.',
    usageCode: `const themeColors = parseCoreThemeColors(settingsMap['site.theme']);
// themeColors: Partial<Record<CoreColorToken, string>>`,
  },
  {
    id: 'resolve-color-recipe-class-name',
    name: 'resolveColorRecipeClassName',
    signature: 'resolveColorRecipeClassName(recipe: ColorRecipe, color: ColorToken): string',
    description:
      'The function every primitive (Button, Badge, Heading, Text, Spinner, Input) calls internally to turn a color prop into Tailwind classes. Exported for custom components that want the same token behavior.',
    usageCode: `import { resolveColorRecipeClassName } from '@inithium/ui';

const className = resolveColorRecipeClassName('solid', 'success');
// -> the same classes <Badge color="success" /> uses internally`,
  },
];

export const THEME_CONCEPTS: readonly ThemeConceptDoc[] = [
  {
    id: 'design-tokens',
    title: 'Design tokens',
    description:
      'Every color in @inithium/ui traces back to a CSS custom property defined once in @inithium/ui/styles.css, under :root. There are 8 core tokens — primary, secondary, accent, muted, success, warning, info, destructive — each paired with a *-foreground counterpart, plus structural tokens (background, foreground, card, border, input, ring, radius, font-primary, font-secondary).',
  },
  {
    id: 'color-modes',
    title: 'Color modes (dark mode)',
    description:
      'Dark mode is a Tailwind v4 custom variant that matches an ancestor carrying .dark or [data-theme="dark"]. globals.css defines the light values under :root and overrides them under .dark, [data-theme="dark"]. There is no shipped toggle hook — the host app is responsible for adding/removing that class or attribute (e.g. on <html>) and persisting the preference.',
    usageCode: `// Toggling dark mode is left to the consuming app, e.g.:
document.documentElement.classList.toggle('dark', prefersDark);
// or
document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';`,
  },
  {
    id: 'no-theme-provider',
    title: 'No ThemeProvider component',
    description:
      '@inithium/ui does not export a ThemeProvider or useTheme hook. Runtime color customization (e.g. a per-tenant brand color from the CMS) is done by calling useApplyCoreThemeColors once near the app root, as seen in apps/web/src/app/app.tsx — there is nothing to wrap children in.',
  },
];

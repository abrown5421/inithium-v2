import { ColorPicker } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

const COLOR_PICKER_DOC: CompositeDoc = {
  overview: (
    <>
      ColorPicker is a hex color text input backed by a popover launcher offering two swatch sources —
      a Tailwind family/intensity grid and a semantic theme-token grid, shown behind tabs when both are
      supplied. It resolves any valid CSS color (hex, oklch, a var(--token) reference) down to a 6-digit
      hex string via a hidden-canvas probe, so callers never need their own color-space math. Fully
      controlled via value/onValueChange, uncontrolled via defaultValue otherwise — the same contract as
      Combobox. Enterprise use cases: theme-color editing (SettingValueEditor's 'color' type), brand
      accent pickers in entity forms.
    </>
  ),
  importStatement: "import { ColorPicker } from '@inithium/ui';",
  composition: [
    { name: 'Input', role: 'The visible hex text field — typing a valid hex code commits immediately.' },
    { name: 'Popover', role: 'Anchors the swatch panel to the input; opens on focus or via the swatch-preview trigger button.' },
    { name: 'Tabs', role: "Switches between the Tailwind and Theme panels when both sources are supplied." },
    { name: 'Slider', role: 'Picks the 100–950 shade intensity within the active Tailwind family.' },
    { name: 'ColorSwatch', role: 'The colored preview square — both the input\'s trailing swatch button and every option in the family/theme grids.' },
  ],
  propGroups: [
    {
      component: 'ColorPicker',
      props: [
        { name: 'value', type: 'string', description: 'Controlled hex value, e.g. #3b82f6.' },
        { name: 'defaultValue', type: 'string', description: 'Initial hex value when uncontrolled.' },
        { name: 'onValueChange', type: '(hex: string) => void', description: 'Fires with a normalized 6-digit hex string on every change.' },
        { name: 'themeColors', type: 'readonly ThemeColorOption[]', defaultValue: '8 core tokens', description: "Semantic swatches offered in the panel. Pass [] to hide that tab." },
        { name: 'tailwindColors', type: 'TailwindPalette', defaultValue: 'full default palette', description: 'Tailwind family → shade palette offered in the panel. Pass {} to hide that tab.' },
        { name: 'placeholder', type: 'string', defaultValue: "'#000000'", description: 'Input placeholder.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input and swatch trigger.' },
        { name: 'error', type: 'boolean | string', description: 'Marks the field invalid and switches it to the destructive palette.' },
        { name: 'required', type: 'boolean', description: 'Marks the underlying input as required.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Tailwind + theme tabs',
      code: `<ColorPicker defaultValue="#3b82f6" />`,
      preview: <ColorPicker defaultValue="#3b82f6" />,
    },
    {
      title: 'Theme tokens only',
      description: "Passing an empty tailwindColors object hides the Tailwind tab entirely, showing just the semantic theme swatches — useful when a field should only ever hold a brand token.",
      code: `<ColorPicker defaultValue="var(--primary)" tailwindColors={{}} />`,
      preview: <ColorPicker defaultValue="var(--primary)" tailwindColors={{}} />,
    },
  ],
};

export const ColorPickerDoc = () => <CompositeDocView doc={COLOR_PICKER_DOC} />;

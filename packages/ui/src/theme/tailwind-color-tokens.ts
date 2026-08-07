/** Tailwind v4's standard default palette families — excludes custom, non-Tailwind hues (like ColorPicker's `mauve`/`olive`/`mist`/`taupe`), which aren't real Tailwind utilities. */
export const TAILWIND_COLOR_FAMILIES = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
] as const;

export type TailwindColorFamilyName = (typeof TAILWIND_COLOR_FAMILIES)[number];

/** Matches the shade range ColorPicker's Tailwind tab already exposes. */
export const TAILWIND_COLOR_SHADES = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

export type TailwindColorShade = (typeof TAILWIND_COLOR_SHADES)[number];

export type TailwindColorValue = `${TailwindColorFamilyName}-${TailwindColorShade}`;

const TAILWIND_COLOR_VALUES: ReadonlySet<string> = new Set(
  TAILWIND_COLOR_FAMILIES.flatMap((family) => TAILWIND_COLOR_SHADES.map((shade) => `${family}-${shade}`)),
);

export function isTailwindColorValue(value: string): value is TailwindColorValue {
  return TAILWIND_COLOR_VALUES.has(value);
}

/** Splits a `TailwindColorValue` (e.g. `"red-500"`) into its shade suffix (e.g. `"500"`). Safe because no family name contains a hyphen. */
export function getTailwindColorShade(value: TailwindColorValue): TailwindColorShade {
  return value.slice(value.lastIndexOf('-') + 1) as TailwindColorShade;
}

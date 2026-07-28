export type ThemeColorToken = 'danger' | 'success' | 'warning' | 'info';

export type TailwindColorBase =
  | 'primary' | 'secondary' | 'accent' | 'surface' | 'surface-contrast'
  | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple'
  | 'fuchsia' | 'pink' | 'rose';

export type TailwindIntensity = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export interface StructuredTailwindColor {
  readonly color: TailwindColorBase;
  readonly intensity: TailwindIntensity;
}

export type ColorProp = ThemeColorToken | StructuredTailwindColor;

export type ColorProperty = 'bg' | 'text' | 'border' | 'outline' | 'ring';

export interface StyleColorProps {
  readonly textColor?: ColorProp;
  readonly bgColor?: ColorProp;
  readonly borderColor?: ColorProp;
  readonly outlineColor?: ColorProp;
  readonly ringColor?: ColorProp;
}
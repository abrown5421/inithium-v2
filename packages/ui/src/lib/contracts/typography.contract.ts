export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
export type FontWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
export type TextAlign = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';

export interface TypographyProps {
  size?: FontSize;
  weight?: FontWeight;
  textAlign?: TextAlign;
  italic?: boolean;
  underline?: boolean;
  strikeThrough?: boolean;
  truncate?: boolean;
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6 | 'none';
}
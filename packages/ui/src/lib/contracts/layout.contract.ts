import { DynamicSpacing } from '../types/tailwind.js';

export type Display = 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';
export type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';
export type JustifyContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type FlexWrap = 'wrap' | 'wrap-reverse' | 'nowrap';

export interface LayoutProps {
  display?: Display;
  direction?: FlexDirection;
  justify?: JustifyContent;
  align?: AlignItems;
  wrap?: FlexWrap;
  gap?: DynamicSpacing | {
    x?: DynamicSpacing;
    y?: DynamicSpacing;
  };
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';
  rows?: 1 | 2 | 3 | 4 | 5 | 6 | 'none';
}
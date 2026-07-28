import { DynamicSpacing } from "../types/tailwind.js";

export type PositionType = 'static' | 'fixed' | 'absolute' | 'relative' | 'sticky';
export type InsetValue = DynamicSpacing | 'auto' | 'full';

export interface PositionProps {
  position?: PositionType;
  inset?: InsetValue | {
    top?: InsetValue;
    right?: InsetValue;
    bottom?: InsetValue;
    left?: InsetValue;
    x?: InsetValue;
    y?: InsetValue;
  };
  zIndex?: 0 | 10 | 20 | 30 | 40 | 50 | 'auto' | number;
}
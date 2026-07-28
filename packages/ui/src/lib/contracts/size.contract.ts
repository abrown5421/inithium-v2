import { DynamicSpacing } from "../types/tailwind.js";

export type DimensionValue = DynamicSpacing | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit';

export interface SizeProps {
  width?: DimensionValue;
  height?: DimensionValue;
  minWidth?: DimensionValue;
  maxWidth?: DimensionValue;
  minHeight?: DimensionValue;
  maxHeight?: DimensionValue;
}
import { DynamicSpacing } from "../types/tailwind.js";

export interface Spacing {
  all?: DynamicSpacing;
  x?: DynamicSpacing;
  y?: DynamicSpacing;
  top?: DynamicSpacing;
  right?: DynamicSpacing;
  bottom?: DynamicSpacing;
  left?: DynamicSpacing;
}

export interface SpacingProps {
  padding?: DynamicSpacing | Spacing;
  margin?: DynamicSpacing | Spacing;
}
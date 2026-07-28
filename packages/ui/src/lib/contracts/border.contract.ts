import { DynamicSpacing } from "../types/tailwind.js";
import { ColorValue } from "./color.contract.js";

export type BorderWidth = '0' | '1' | '2' | '4' | '8' | DynamicSpacing;
export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
export type RadiusValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | DynamicSpacing;

export interface BorderProps {
  border?: boolean | BorderWidth | {
    width?: BorderWidth;
    style?: BorderStyle;
    top?: BorderWidth;
    right?: BorderWidth;
    bottom?: BorderWidth;
    left?: BorderWidth;
  };
  borderColor?: ColorValue;
  radius?: RadiusValue | {
    top?: RadiusValue;
    right?: RadiusValue;
    bottom?: RadiusValue;
    left?: RadiusValue;
    topLeft?: RadiusValue;
    topRight?: RadiusValue;
    bottomLeft?: RadiusValue;
    bottomRight?: RadiusValue;
  };
}
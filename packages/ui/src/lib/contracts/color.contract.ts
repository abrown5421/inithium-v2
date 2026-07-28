import { TailwindColor, ThemeIntensity, ThemeToken } from "../types/tailwind.js";

export type ExtendedColor = {
  color: TailwindColor;
  intensity?: ThemeIntensity;
};

export type ThemeTokenConfig = {
  token: ThemeToken;
};

export type ColorValue = ThemeToken | ThemeTokenConfig | ExtendedColor;

export interface ColorableProps {
  textColor?: ColorValue;
  backgroundColor?: ColorValue;
  borderColor?: ColorValue;
  ringColor?: ColorValue;
}
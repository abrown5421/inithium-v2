import { ANIMATE_CSS_NAMES } from "../constants/animation.js";
import { TAILWIND_COLORS, TAILWIND_INTENSITIES, THEME_TOKENS } from "../constants/color.js";
import { SPACING_SCALES } from "../constants/spacing.js";

export type TailwindColor = typeof TAILWIND_COLORS[number];
export type ThemeIntensity = typeof TAILWIND_INTENSITIES[number];
export type ThemeToken = typeof THEME_TOKENS[number];
export type AnimationName = typeof ANIMATE_CSS_NAMES[number];

export type SpacingScale = typeof SPACING_SCALES[number] | number;
export type ArbitraryValue = `[${string}]`;
export type DynamicSpacing = SpacingScale | ArbitraryValue;
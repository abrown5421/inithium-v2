import type { CoreColorToken } from './color-tokens.js';
import type { TailwindColorValue } from './tailwind-color-tokens.js';

/** Either one of the 8 core theme tokens (e.g. `"primary"`) or an exact Tailwind palette shade (e.g. `"red-500"`). */
export type ColorToken = CoreColorToken | TailwindColorValue;

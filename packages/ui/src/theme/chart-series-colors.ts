import { CORE_COLOR_TOKENS } from './color-tokens.js';

export const CHART_SERIES_COLOR_VARS: readonly string[] = CORE_COLOR_TOKENS.map((token) => `var(--${token})`);

import { cn } from '../utils/cn.js';
import type { ColorRecipe } from './color-recipes.js';
import { getTailwindColorShade, type TailwindColorShade, type TailwindColorValue } from './tailwind-color-tokens.js';
import {
  TW_BG,
  TW_BORDER,
  TW_CHECKED_BG,
  TW_FOCUS_BORDER,
  TW_FOCUS_RING,
  TW_HOVER_SOFT,
  TW_HOVER_STRONG,
  TW_SELECTION_BG,
  TW_SOFT_BG,
  TW_SOFT_BORDER,
  TW_SOFT_ICON,
  TW_TEXT,
  TW_TOAST_BG,
  TW_TOAST_BORDER,
} from './tailwind-color-class-maps.js';

type ShadeClassMap = Readonly<Record<TailwindColorShade, string>>;

/**
 * Whether a shade needs light or dark text on top of it depends only on the
 * shade number, not the family — every Tailwind family's `100`-`400` reads as
 * light, `500`-`950` as dark, closely enough to use a single fixed threshold
 * rather than computing per-family contrast.
 */
const SOLID_CONTRAST_TEXT_BY_SHADE: ShadeClassMap = {
  '100': 'text-neutral-900',
  '200': 'text-neutral-900',
  '300': 'text-neutral-900',
  '400': 'text-neutral-900',
  '500': 'text-white',
  '600': 'text-white',
  '700': 'text-white',
  '800': 'text-white',
  '900': 'text-white',
  '950': 'text-white',
};

const SELECTION_CONTRAST_TEXT_BY_SHADE: ShadeClassMap = {
  '100': 'selection:text-neutral-900',
  '200': 'selection:text-neutral-900',
  '300': 'selection:text-neutral-900',
  '400': 'selection:text-neutral-900',
  '500': 'selection:text-white',
  '600': 'selection:text-white',
  '700': 'selection:text-white',
  '800': 'selection:text-white',
  '900': 'selection:text-white',
  '950': 'selection:text-white',
};

/** Mirrors `getColorRecipeClassName`'s cases, but resolving against an exact Tailwind palette shade instead of a core token. */
export function getTailwindColorRecipeClassName(recipe: ColorRecipe, color: TailwindColorValue): string {
  const shade = getTailwindColorShade(color);
  switch (recipe) {
    case 'solid':
      return cn(TW_BG[color], SOLID_CONTRAST_TEXT_BY_SHADE[shade], TW_HOVER_STRONG[color]);
    case 'outlined':
      return cn(TW_BORDER[color], TW_TEXT[color], TW_HOVER_SOFT[color]);
    case 'ghost':
      return cn(TW_TEXT[color], TW_HOVER_SOFT[color]);
    case 'link':
      return cn(TW_TEXT[color], 'hover:underline');
    case 'soft':
      return cn(TW_SOFT_BORDER[color], TW_SOFT_BG[color], TW_TEXT[color], TW_SOFT_ICON[color]);
    case 'toast':
      return cn(TW_TOAST_BORDER[color], TW_TOAST_BG[color], TW_TEXT[color], TW_SOFT_ICON[color]);
    case 'plain':
      return TW_TEXT[color];
    case 'fill':
      return TW_BG[color];
    case 'border':
      return TW_BORDER[color];
    case 'checked':
      return TW_CHECKED_BG[color];
    case 'field':
      return cn(TW_TEXT[color], TW_FOCUS_BORDER[color], TW_FOCUS_RING[color], TW_SELECTION_BG[color], SELECTION_CONTRAST_TEXT_BY_SHADE[shade]);
  }
}

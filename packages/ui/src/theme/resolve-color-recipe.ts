import { isCoreColorToken } from './color-tokens.js';
import { getColorRecipeClassName, type ColorRecipe } from './color-recipes.js';
import { getTailwindColorRecipeClassName } from './tailwind-color-recipes.js';
import type { ColorToken } from './color-value.js';

/** Dispatches to the core-token or Tailwind-shade recipe resolver depending on which kind of `ColorToken` was passed. */
export function resolveColorRecipeClassName(recipe: ColorRecipe, color: ColorToken): string {
  if (isCoreColorToken(color)) {
    return getColorRecipeClassName(recipe, color);
  }
  return getTailwindColorRecipeClassName(recipe, color);
}

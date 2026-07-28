import { ColorProp, ColorProperty, StyleColorProps } from '@inithium/types';
import { THEME_TOKEN_CLASS_MAP } from './color.constants.js';

export const resolveColorClass = (
  property: ColorProperty,
  color?: ColorProp
): string => {
  if (!color) return '';

  if (typeof color === 'string') {
    return THEME_TOKEN_CLASS_MAP[property]?.[color] ?? '';
  }

  return `${property}-${color.color}-${color.intensity}`;
};

export const useColorResolver = (props: StyleColorProps): string => {
  const propertyMap: readonly (readonly [ColorProperty, ColorProp | undefined])[] = [
    ['text', props.textColor],
    ['bg', props.bgColor],
    ['border', props.borderColor],
    ['outline', props.outlineColor],
    ['ring', props.ringColor],
  ];

  return propertyMap
    .map(([prop, val]) => resolveColorClass(prop, val))
    .filter(Boolean)
    .join(' ');
};
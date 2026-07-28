import { SpacingProps, Spacing } from '../contracts/spacing.contract.js';
import { formatArbitrary } from '../utils/string.js';

const resolveAxisOrSide = (type: 'p' | 'm', spacing: Spacing): string[] => {
  const classes: string[] = [];
  if (spacing.all !== undefined) classes.push(`${type}-${formatArbitrary(spacing.all)}`);
  if (spacing.x !== undefined) classes.push(`${type}x-${formatArbitrary(spacing.x)}`);
  if (spacing.y !== undefined) classes.push(`${type}y-${formatArbitrary(spacing.y)}`);
  if (spacing.top !== undefined) classes.push(`${type}t-${formatArbitrary(spacing.top)}`);
  if (spacing.right !== undefined) classes.push(`${type}r-${formatArbitrary(spacing.right)}`);
  if (spacing.bottom !== undefined) classes.push(`${type}b-${formatArbitrary(spacing.bottom)}`);
  if (spacing.left !== undefined) classes.push(`${type}l-${formatArbitrary(spacing.left)}`);
  return classes;
};

export const resolveSpacing = (props: SpacingProps): string[] => {
  const classes: string[] = [];
  
  if (props.padding !== undefined) {
    if (typeof props.padding === 'object') {
      classes.push(...resolveAxisOrSide('p', props.padding));
    } else {
      classes.push(`p-${formatArbitrary(props.padding)}`);
    }
  }
  
  if (props.margin !== undefined) {
    if (typeof props.margin === 'object') {
      classes.push(...resolveAxisOrSide('m', props.margin));
    } else {
      classes.push(`m-${formatArbitrary(props.margin)}`);
    }
  }
  
  return classes;
};
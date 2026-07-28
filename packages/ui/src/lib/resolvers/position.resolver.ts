import { PositionProps } from '../contracts/position.contract.js';
import { formatArbitrary } from '../utils/string.js';

export const resolvePosition = (props: PositionProps): string[] => {
  const classes: string[] = [];
  if (props.position) classes.push(props.position);
  if (props.zIndex !== undefined) classes.push(`z-${props.zIndex}`);

  if (props.inset !== undefined) {
    if (typeof props.inset === 'object') {
      if (props.inset.top !== undefined) classes.push(`top-${formatArbitrary(props.inset.top)}`);
      if (props.inset.right !== undefined) classes.push(`right-${formatArbitrary(props.inset.right)}`);
      if (props.inset.bottom !== undefined) classes.push(`bottom-${formatArbitrary(props.inset.bottom)}`);
      if (props.inset.left !== undefined) classes.push(`left-${formatArbitrary(props.inset.left)}`);
      if (props.inset.x !== undefined) classes.push(`inset-x-${formatArbitrary(props.inset.x)}`);
      if (props.inset.y !== undefined) classes.push(`inset-y-${formatArbitrary(props.inset.y)}`);
    } else {
      classes.push(`inset-${formatArbitrary(props.inset)}`);
    }
  }

  return classes;
};
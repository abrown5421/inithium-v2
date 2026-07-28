import { BorderProps } from '../contracts/border.contract.js';
import { formatArbitrary } from '../utils/string.js';

export const resolveBorder = (props: BorderProps): string[] => {
  const classes: string[] = [];

  if (props.border !== undefined) {
    if (typeof props.border === 'boolean') {
      if (props.border) classes.push('border');
    } else if (typeof props.border === 'object') {
      const { width, style, top, right, bottom, left } = props.border;
      if (style) classes.push(`border-${style}`);
      if (width) classes.push(`border-${formatArbitrary(width)}`);
      if (top) classes.push(`border-t-${formatArbitrary(top)}`);
      if (right) classes.push(`border-r-${formatArbitrary(right)}`);
      if (bottom) classes.push(`border-b-${formatArbitrary(bottom)}`);
      if (left) classes.push(`border-l-${formatArbitrary(left)}`);
    } else {
      classes.push(`border-${formatArbitrary(props.border)}`);
    }
  }

  if (props.radius !== undefined) {
    if (typeof props.radius === 'object') {
      const { top, right, bottom, left, topLeft, topRight, bottomLeft, bottomRight } = props.radius;
      if (top) classes.push(`rounded-t-${formatArbitrary(top)}`);
      if (right) classes.push(`rounded-r-${formatArbitrary(right)}`);
      if (bottom) classes.push(`rounded-b-${formatArbitrary(bottom)}`);
      if (left) classes.push(`rounded-l-${formatArbitrary(left)}`);
      if (topLeft) classes.push(`rounded-tl-${formatArbitrary(topLeft)}`);
      if (topRight) classes.push(`rounded-tr-${formatArbitrary(topRight)}`);
      if (bottomLeft) classes.push(`rounded-bl-${formatArbitrary(bottomLeft)}`);
      if (bottomRight) classes.push(`rounded-br-${formatArbitrary(bottomRight)}`);
    } else if (props.radius === 'md') {
      classes.push('rounded');
    } else {
      classes.push(`rounded-${formatArbitrary(props.radius)}`);
    }
  }

  return classes;
};